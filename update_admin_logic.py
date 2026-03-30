import re

"""
PirateWyki: Update Admin Logic Utility
------------------------------------
Script para automatizar la refactorización de dashboard.html, 
especialmente para cambiar botones de submit por botones normales.
"""

def fix_dashboard_buttons():
    file_path = 'pages/admin/dashboard.html'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex para encontrar botones de submit y cambiarlos a button
    # Esto es similar a lo que estoy haciendo manualmente como asistente AI
    new_content = re.sub(r'<button type="submit"', '<button type="button"', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Dashboard buttons fixed.")

if __name__ == "__main__":
    # Descomentar para aplicar masivamente (¡Cuidado con los botones que SÍ deben ser submit!)
    # fix_dashboard_buttons()
    pass
