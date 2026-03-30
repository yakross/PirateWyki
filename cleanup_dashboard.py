import os
import re

"""
PirateWyki: Cleanup Dashboard Utility
------------------------------------
Este script analiza dashboard.html para encontrar posibles errores comunes como:
- IDs duplicadas
- Botones de submit que deberían ser type="button"
- Funciones definidas pero no usadas (opcional)
"""

def analyze_dashboard():
    file_path = 'pages/admin/dashboard.html'
    if not os.path.exists(file_path):
        print(f"No se encontró {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"--- Análisis de {file_path} ---")
    
    # 1. Buscar IDs duplicados
    ids = re.findall(r'id=["\'](.*?)["\']', content)
    seen = {}
    duplicates = []
    for _id in ids:
        if _id in seen:
            duplicates.append(_id)
        seen[_id] = True
    
    if duplicates:
        print(f"⚠ IDs Duplicados encontrados ({len(duplicates)}):")
        for d in set(duplicates):
            print(f"  - {d}")
    else:
        print("✅ No hay IDs duplicados.")

    # 2. Buscar botones submit sospechosos (pueden causar redirección)
    submits = re.findall(r'<button[^>]*type=["\']submit["\'][^>]*>', content)
    if submits:
        print(f"⚠ Se encontraron {len(submits)} botones de tipo 'submit'.")
        print("  Recomendación: Cambiarlos a type='button' y usar onclick para evitar redirecciones.")
    
    # 3. Buscar formularios sin onsubmit return false
    forms = re.findall(r'<form[^>]*>', content)
    forms_without_prevent = [f for f in forms if 'onsubmit' not in f]
    if forms_without_prevent:
        print(f"⚠ {len(forms_without_prevent)} formularios podrían no estar previniendo el envío por defecto.")

if __name__ == "__main__":
    analyze_dashboard()
