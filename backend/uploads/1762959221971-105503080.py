import os
import time
import threading
import queue
import psutil
import subprocess
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

class TaskManager:
    def __init__(self, pdf_filename="procesos_sistema.pdf"):
        self.pdf_logger = PDFLogger(pdf_filename)
        self.tasks = {'executable': {}}
        self.queues = {'executable': queue.Queue()}
        self.in_progress = {}
        self.lock = threading.Lock()
        self.execution_active = False

    def get_timestamp(self):
        """Obtiene el timestamp actual con formato."""
        return datetime.now().strftime("%H:%M:%S")

    def log(self, message):
        """Registra un mensaje en el PDF."""
        timestamp = self.get_timestamp()
        full_message = f"[{timestamp}] {message}"
        self.pdf_logger.add_paragraph(full_message, 'Log')

    def create_task(self, task_id):
        """Crea una nueva tarea ejecutable y la agrega a la cola."""
        if task_id in self.tasks['executable']:
            return False
        self.queues['executable'].put(task_id)
        self.log(f"Tarea ejecutable {task_id} creada y agregada a la cola.")
        return True

    def delete_task(self, task_id):
        """Elimina una tarea ejecutable y termina su proceso usando el PID."""
        with self.lock:
            if task_id not in self.tasks['executable']:
                self.log(f"ERROR: La tarea ejecutable {task_id} no existe.")
                return
            pid = self.tasks['executable'].pop(task_id, None)
        if pid:
            try:
                process = psutil.Process(pid)
                process.terminate()
                process.wait(timeout=3)
                self.log(f"Proceso {pid} (tarea {task_id}) terminado exitosamente.")
            except psutil.TimeoutExpired:
                process.kill()
                self.log(f"Proceso {pid} (tarea {task_id}) forzado a terminar.")
            except psutil.NoSuchProcess:
                self.log(f"Proceso {pid} (tarea {task_id}) ya no existe.")
            except psutil.AccessDenied:
                self.log(f"ERROR: No se tiene permiso para terminar el proceso {pid} (tarea {task_id}).")
        self.log(f"Tarea ejecutable {task_id} eliminada.")

    def worker(self, name):
        """Worker para procesar tareas ejecutables (Bloc de notas)."""
        pid = os.getpid()
        while self.execution_active:
            try:
                task = self.queues['executable'].get(timeout=1)
            except queue.Empty:
                continue

            with self.lock:
                self.in_progress[name] = f"EXEC-{task}"

            self.log(f"[PID={pid}] {name} -> inicia tarea {task}")
            try:
                executable = 'notepad.exe' if os.name == 'nt' else 'gedit'
                process = subprocess.Popen(executable)
                exec_pid = process.pid
                with self.lock:
                    self.tasks['executable'][task] = exec_pid
                self.log(f"[PID={pid}] {name} -> Bloc de notas iniciado con PID real: {exec_pid} para tarea {task}")

                # Esperar a que el usuario decida terminar la ejecución o que el programa termine
                while task in self.tasks['executable'] and self.execution_active:
                    time.sleep(0.5)

                if task not in self.tasks['executable']:
                    self.log(f"[PID={pid}] {name} -> Tarea {task} ya eliminada por el usuario.")
                else:
                    process.wait()
                    with self.lock:
                        self.tasks['executable'].pop(task, None)
                    self.log(f"[PID={pid}] {name} -> Bloc de notas con PID {exec_pid} cerrado naturalmente para tarea {task}")

            except Exception as e:
                self.log(f"[PID={pid}] {name} -> ERROR ejecutando tarea {task}: {e}")

            self.log(f"[PID={pid}] {name} -> termina tarea {task}")
            with self.lock:
                self.in_progress.pop(name, None)
            self.queues['executable'].task_done()

    def run(self):
        """Ejecuta el procesamiento de tareas."""
        self.execution_active = True
        self.pdf_logger.add_paragraph(f"Proceso PID={os.getpid()} | Hilo principal NID={threading.get_native_id()}")
        self.pdf_logger.add_task_list(self.tasks)
        self.pdf_logger.add_process_list()
        self.pdf_logger.add_paragraph("REGISTRO DE EJECUCIÓN (LOG)", 'Header')

        # Iniciar worker
        worker_thread = threading.Thread(target=self.worker, args=('worker-executable',), daemon=True)
        worker_thread.start()

        try:
            response = input("\n¿Quieres ejecutar una nueva tarea (Sí/No)? ").lower().strip()
            if response in ('sí', 'si', 's', 'y', 'yes'):
                task_id = 1
                if self.create_task(task_id):
                    time.sleep(1)  # Esperar para que el worker procese y obtenga el PID
                    terminate_response = input(f"¿Quieres terminar la ejecución (Sí/No)? ").lower().strip()
                    if terminate_response in ('sí', 'si', 's', 'y', 'yes'):
                        self.delete_task(task_id)
            elif response in ('no', 'n'):
                pass
            else:
                pass
        except KeyboardInterrupt:
            print("\nDeteniendo ejecución...")

        for task_id, pid in list(self.tasks['executable'].items()):
            try:
                process = psutil.Process(pid)
                process.terminate()
                process.wait(timeout=3)
                self.log(f"Proceso {pid} (tarea {task_id}) terminado durante cierre del programa.")
            except psutil.TimeoutExpired:
                process.kill()
                self.log(f"Proceso {pid} (tarea {task_id}) forzado a terminar durante cierre.")
            except psutil.NoSuchProcess:
                pass

        self.execution_active = False
        time.sleep(1)
        self.log("Programa finalizado.")
        self.pdf_logger.save()
        print("\nEjecución finalizada. Todos los eventos se han guardado en el PDF.")

class PDFLogger:
    def __init__(self, filename):
        self.filename = filename
        self.doc = SimpleDocTemplate(filename, pagesize=letter)
        self.story = []
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()

    def setup_custom_styles(self):
        self.styles.add(ParagraphStyle(
            name='Header', parent=self.styles['Heading1'], fontSize=14, textColor=colors.darkblue, spaceAfter=12))
        self.styles.add(ParagraphStyle(
            name='Log', parent=self.styles['Normal'], fontSize=9, fontName='Courier', spaceAfter=6))
        self.styles.add(ParagraphStyle(
            name='Process', parent=self.styles['Normal'], fontSize=8, fontName='Courier', spaceAfter=3))

    def add_paragraph(self, text, style='Normal'):
        self.story.append(Paragraph(text, self.styles[style]))
        self.story.append(Spacer(1, 12))

    def add_task_list(self, tasks):
        self.add_paragraph("LISTA DE TAREAS EJECUTABLES", 'Header')
        data = [['ID TAREA', 'Tipo']]
        for task in tasks['executable']:
            data.append([str(task), "Ejecutable"])
        if len(data) > 1:
            self.add_table(data, col_widths=[1.5*inch, 1.5*inch])

    def add_process_list(self):
        processes = sorted(
            [(proc.info['pid'], proc.info['name'], proc.info['status'].capitalize())
             for proc in psutil.process_iter(['pid', 'name', 'status'])],
            key=lambda x: x[1].lower()
        )
        self.add_paragraph("LISTA DE PROCESOS EN EJECUCIÓN", 'Header')
        data = [['PID', 'Nombre del Proceso', 'Estado']] + [[str(p[0]), p[1], p[2]] for p in processes]
        self.add_table(data, col_widths=[0.8*inch, 3.5*inch, 1*inch])

    def add_table(self, data, col_widths=None):
        if len(data) <= 1:
            return
        table = Table(data, colWidths=col_widths)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        self.story.append(table)
        self.story.append(Spacer(1, 20))

    def save(self):
        try:
            self.doc.build(self.story)
            print(f"PDF guardado exitosamente: {self.filename}")
        except Exception as e:
            print(f"ERROR al guardar el PDF: {e}")

if __name__ == "__main__":
    manager = TaskManager()
    manager.run()