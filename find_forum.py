import os

"""
PirateWyki: Find Forum Utility
---------------------------
Busca referencias al sistema de foro en el código para asegurar que 
las categorías y hilos se manejen correctamente.
"""

def search_forum_logic():
    search_terms = ["forumCategories", "forumThreads", "forum_categories", "forum_threads"]
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith(('.html', '.js')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            for term in search_terms:
                                if term in line:
                                    print(f"Encontrado '{term}' en {path}:{i+1}")
                except:
                    pass

if __name__ == "__main__":
    search_forum_logic()
