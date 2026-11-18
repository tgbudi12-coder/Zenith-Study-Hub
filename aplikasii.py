import os
import sys
import webview

def get_resource_path(relative_path):
    """Mendapatkan path absolut file agar tetap terbaca setelah dibungkus menjadi .exe"""
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

def launch_desktop_app():
    """Fungsi utama untuk menjalankan Zenith Study Hub sebagai aplikasi desktop"""
    html_file = get_resource_path("index.html")
    
    if not os.path.exists(html_file):
        print("Error: Berkas index.html tidak ditemukan!")
        return

    # Membuat jendela aplikasi desktop native
    window = webview.create_window(
        title="Zenith Study Hub - Desktop Edition",
        url=html_file,
        width=820,
        height=680,
        resizable=True,
        min_size=(400, 500)
    )
    webview.start()

if __name__ == "__main__":
    launch_desktop_app()