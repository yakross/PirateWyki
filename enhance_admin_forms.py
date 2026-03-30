import os

"""
PirateWyki: Admin Form Enhancer Utility
--------------------------------------
Este script ayuda a generar fragmentos de código para agregar nuevos campos 
a los formularios de dashboard.html de forma consistente.
"""

def generate_form_field(label, field_id, type="text", placeholder=""):
    field_html = f'''
    <div class="form-group">
        <label class="form-label">{label}</label>
        <input type="{type}" class="form-control" id="{field_id}" placeholder="{placeholder}">
    </div>
    '''
    print(field_html)
    return field_html

if __name__ == "__main__":
    # Ejemplo: Crear campo para "Tiempo de Decodificación"
    generate_form_field("Tiempo de Decodificación (seg)", "shipDecryptTime", "number", "Ej: 3600")
