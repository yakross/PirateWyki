/**
 * GalaxWiki — i18n.js
 * Sistema de internacionalización completo (ES / EN / DE).
 * Uso en HTML: <span data-i18n="key"></span>
 *              <input data-i18n-placeholder="key">
 *              <element data-i18n-title="key">
 */

const translations = {

    // ════════════════════════════════════════════════════════════
    //  ESPAÑOL  (idioma base)
    // ════════════════════════════════════════════════════════════
    es: {
        'nav.home':'Inicio','nav.ships':'Naves','nav.builds':'Builds','nav.components':'Componentes',
        'nav.enemies':'Enemigos','nav.systems':'Sistemas','nav.planets':'Planetas','nav.missions':'Misiones',
        'nav.paints':'Pinturas','nav.drones':'Drones','nav.cortex':'Cortex','nav.gravitons':'Gravitones',
        'nav.misc':'Misc Info','nav.calculator':'Calculadora','nav.forum':'Foro','nav.news':'Noticias',
        'nav.compare':'Comparar','nav.search':'Buscar...','nav.maps':'Mapas',
        'auth.login':'Iniciar sesión','auth.register':'Registrarse','auth.logout':'Cerrar sesión',
        'auth.back_home':'Volver al inicio','auth.or_email':'o usa tu correo',
        'auth.or_register':'o regístrate con correo','auth.email':'Correo electrónico',
        'auth.password':'Contraseña','auth.forgot_pw':'¿Olvidaste tu contraseña?',
        'auth.no_account':'¿No tienes cuenta?','auth.has_account':'¿Ya tienes cuenta?',
        'auth.sign_in_here':'Inicia sesión','auth.sign_up_here':'Regístrate aquí',
        'auth.google':'Continuar con Google','auth.creating':'Creando cuenta...',
        'auth.login_required':'Inicia sesión',
        'register.title':'Crear cuenta','register.username':'Nombre de usuario',
        'register.fleet':'Flota','register.fleet_optional':'(opcional)',
        'register.confirm_password':'Confirmar contraseña','register.submit':'Crear cuenta',
        'register.google_warning':'El acceso con Google requiere un dominio autorizado. Si ves un error, usa el registro por correo.',
        'profile.myprofile':'Mi Perfil','profile.collection':'Mi Colección',
        'profile.favorites':'Favoritos','profile.settings':'Configuración','profile.admin':'Panel Admin',
        'profile.title':'Mi Perfil','profile.subtitle':'Tu perfil de usuario en GalaxWiki.',
        'profile.loading':'Cargando...','profile.login_needed':'Para ver tu perfil necesitas estar registrado.',
        'profile.admin_badge':'Admin','profile.user_badge':'Usuario','profile.no_fleet':'Sin flota',
        'profile.server':'Servidor: ','profile.level':'Nivel ','profile.member_since':'Miembro desde ',
        'profile.posts':'Mensajes','profile.xp':'XP total','profile.no_items':'0 elementos guardados.',
        'profile.tracker_hint':'Lleva el control de los planos que ya conseguiste.',
        'profile.view_favs':'Ver favoritos',
        'settings.subtitle':'Gestiona tu cuenta y preferencias.',
        'settings.login_needed':'Para cambiar tu configuración necesitas estar registrado.',
        'settings.avatar':'Foto de perfil','settings.avatar_hint':'PNG, JPG, WEBP o GIF · máx 300 KB',
        'settings.processing':'Procesando imagen...','settings.username':'Nombre de usuario',
        'settings.server':'Servidor','settings.server_select':'— Seleccionar servidor —',
        'settings.pilot_level':'Nivel de piloto','settings.change_pw':'Cambiar contraseña',
        'settings.new_pw':'Nueva contraseña','settings.confirm_pw':'Confirmar contraseña',
        'settings.save':'Guardar cambios','settings.saved':'✓ Cambios guardados',
        'ships.title':'Base de Naves','ships.scale_label':'Escala de estadísticas:',
        'ships.grade_e':'E — Muy bajo','ships.grade_d':'D — Bajo','ships.grade_c':'C — Medio',
        'ships.grade_b':'B — Bueno','ships.grade_a':'A — Muy bueno','ships.grade_s':'S — Excepcional',
        'ships.filter_type':'Tipo: todos','ships.filter_faction':'Facción: todas',
        'ships.filter_level':'Nivel requerido: todos','ships.compare':'Comparar',
        'ships.load_more':'Cargar más...','ships.no_results':'No se encontraron naves con esos filtros.',
        'components.title':'Componentes','components.filter_type':'Tipo: todos',
        'components.filter_rarity':'Rareza: todas','components.filter_faction':'Facción: todas',
        'components.no_results':'No se encontraron componentes.','components.load_more':'Cargar más...',
        'enemies.title':'Enemigos','enemies.filter_type':'Tipo: todos',
        'enemies.type_normal':'Normal','enemies.type_boss':'Boss','enemies.type_event':'Evento',
        'enemies.type_mission':'Misión','enemies.filter_size':'Ligeros','enemies.size_medium':'Medianos',
        'enemies.size_heavy':'Verdes','enemies.filter_level':'Nivel: todos',
        'enemies.col_name':'Nombre','enemies.col_level':'Nivel','enemies.col_type':'Tipo',
        'enemies.col_drops':'Drops','enemies.no_results':'No hay enemigos registrados todavía.',
        'enemies.load_error':'Error al cargar enemigos. Revisa la consola y las reglas de Firestore.',
        'enemies.drops_label':'Drops:',
        'missions.title':'Misiones','missions.no_results':'No hay misiones registradas todavía.',
        'systems.title':'Sistemas Estelares','planets.title':'Planetas',
        'forum.title':'Foro Comunitario',
        'forum.subtitle':'Comparte estrategias, pide ayuda y conecta con otros jugadores de Pirate Galaxy.',
        'forum.categories':'Categorías','forum.threads':'Hilos','forum.replies':'Respuestas',
        'forum.no_categories':'El foro aún no tiene categorías.',
        'forum.admin_hint':'El administrador puede crearlas desde el panel admin.',
        'forum.firebase_error':'Error: Firebase no inicializado. Revisa la configuración.',
        'forum.new_thread':'Nuevo hilo','forum.reply':'Responder','forum.post':'Publicar',
        'forum.login_to_post':'Inicia sesión para participar en el foro.',
        'news.subtitle':'Últimas actualizaciones, eventos y novedades de Pirate Galaxy y la wiki.',
        'news.empty':'No hay noticias aún','news.empty_hint':'Las noticias publicadas aparecerán aquí.',
        'news.load_error':'Error al cargar las noticias','news.retry':'Reintentar',
        'news.read_more':'Leer más',
        'search.title':'Búsqueda Global','search.placeholder':'Busca en toda la wiki...',
        'search.no_results':'No se encontraron resultados. Prueba con otras palabras clave.',
        'favs.login_needed':'Para guardar y ver favoritos necesitas estar registrado.',
        'favs.filter_all':'Todos','favs.filter_paints':'Pinturas','favs.filter_drones':'Drones',
        'favs.filter_cortex':'Cortex','favs.filter_gravs':'Gravitones','favs.filter_planets':'Planetas',
        'favs.empty':'No tienes favoritos en esta categoría.','favs.remove':'Quitar de favoritos',
        'calc.title':'Calculadora','calc.subtitle':'Calcula estadísticas de naves y componentes.',
        'footer.home':'Inicio','footer.ships':'Base de Naves','footer.components':'Componentes',
        'footer.forum':'Foro Comunitario','footer.about':'Acerca del Juego',
        'footer.quick_links':'Accesos Rápidos','footer.community':'Comunidad',
        'footer.community_desc':'Únete y contribuye a la mayor base de datos hispana de Pirate Galaxy.',
        'footer.branding_desc':'La enciclopedia comunitaria definitiva. Encuentra toda la información sobre naves, sistemas, y componentes para dominar el universo.',
        'footer.copyright':'GalaxWiki. Una herramienta no oficial creada por fans.',
        'footer.trademark':'"Pirate Galaxy" es una marca registrada de',
        'common.loading':'Cargando...','common.error':'Error','common.save':'Guardar',
        'common.cancel':'Cancelar','common.delete':'Eliminar','common.edit':'Editar',
        'common.add':'Agregar','common.search':'Buscar...','common.filter':'Filtrar',
        'common.all':'Todos','common.none':'Ninguno','common.yes':'Sí','common.no':'No',
        'common.confirm':'Confirmar','common.close':'Cerrar','common.back':'Volver',
        'common.next':'Siguiente','common.prev':'Anterior','common.name':'Nombre',
        'common.level':'Nivel','common.type':'Tipo','common.faction':'Facción',
        'common.rarity':'Rareza','common.description':'Descripción','common.image':'Imagen',
        'common.required':'(requerido)','common.optional':'(opcional)',
        'common.updated_at':'Actualizado: ','common.no_name':'Sin nombre','common.no_desc':'Sin descripción',
        'common.actions':'Acciones','common.status':'Estado','common.date':'Fecha',
        'common.created_at':'Creado: ','common.by':'por',
        'hero.welcome':'Bienvenido a GalaxWiki',
        'hero.description':'La enciclopedia definitiva de Pirate Galaxy. Encuentra información sobre naves, componentes, enemigos, misiones y mucho más.',
        'hero.search_placeholder':'Buscar naves, componentes, enemigos... (Ctrl+K)',
        'hero.stat_ships':'Naves','hero.stat_components':'Componentes',
        'hero.stat_enemies':'Enemigos','hero.stat_users':'Usuarios',
        'home.explore':'Explora la Wiki','home.featured':'Misiones, Noticias y Foro',
        'home.latest_news':'Últimas noticias','home.news_error':'No se pudieron cargar las noticias.',
        'home.ships_title':'Base de Naves','home.ships_desc':'Explora todas las naves disponibles en Pirate Galaxy, estadísticas, requisitos y dónde conseguirlas.',
        'home.components_title':'Componentes','home.components_desc':'Descubre todos los componentes, atributos y cómo mejorar tu nave al máximo.',
        'home.enemies_title':'Enemigos y Drops','home.enemies_desc':'Información sobre enemigos, drops y las mejores estrategias para farmear.',
        'home.systems_title':'Sistemas Universales','home.systems_desc':'Mapas de sistemas, planetas y sectores con recursos disponibles.',
        'home.missions_title':'Misiones','home.missions_desc':'Guías de misiones, recompensas y objetivos. Planifica tu progreso en el juego.',
        'home.missions_cta':'Ver misiones','home.news_title':'Noticias',
        'home.news_desc':'Últimas actualizaciones, eventos y cambios del juego. No te pierdas nada.',
        'home.news_cta':'Leer noticias','home.forum_title':'Foro',
        'home.forum_desc':'Comparte estrategias, preguntas y conecta con la comunidad de jugadores.',
        'home.forum_cta':'Ir al foro',
        'admin.panel_title':'Panel Admin',
        'admin.dashboard':'Dashboard','admin.users':'Usuarios','admin.ships':'Naves',
        'admin.builds':'Builds','admin.components':'Componentes','admin.enemies':'Enemigos',
        'admin.missions':'Misiones','admin.game_story':'Historia del Juego','admin.paints':'Pinturas',
        'admin.drones':'Drones','admin.cortex':'Cortex','admin.gravitons':'Gravitones',
        'admin.systems':'Sistemas','admin.planets':'Planetas','admin.servers':'Servidores',
        'admin.conquest':'Conquista por servidor','admin.news':'Noticias','admin.forum':'Foro',
        'admin.misc_info':'Misc Info','admin.sirius':'Singularidad Sirius',
        'admin.survival':'Guías Supervivencia','admin.conquest_info':'Info Conquista',
        'admin.clan_info':'Info Clanes','admin.reports':'Reportes',
        'admin.factions':'Facciones','admin.ship_types':'Tipos de nave',
        'admin.component_types':'Tipos de arma/componente','admin.component_rarities':'Rarezas de arma',
        'admin.enemy_types':'Tipos de enemigo','admin.paint_types':'Tipos de pintura',
        'admin.paint_rarities':'Rarezas de pintura','admin.drone_types':'Tipos de drone',
        'admin.stat_users':'Usuarios','admin.stat_ships':'Naves',
        'admin.stat_components':'Componentes','admin.stat_enemies':'Enemigos',
        'admin.init_db':'Inicializar colecciones','admin.back_site':'Volver al sitio',
        'admin.users_title':'Gestión de Usuarios',
        'admin.users_subtitle':'Lista de cuentas registradas. Solo los usuarios con rol Admin pueden acceder al panel y asignar roles.',
        'admin.users_search':'Buscar por nombre, email o flota...',
        'admin.users_col_user':'Usuario','admin.users_col_email':'Email',
        'admin.users_col_fleet':'Flota','admin.users_col_role':'Rol','admin.users_col_actions':'Acciones',
        'admin.users_loading':'Cargando usuarios...','admin.users_not_found':'No se encontraron usuarios.',
        'admin.users_make_admin':'Hacer admin','admin.users_remove_admin':'Quitar admin',
        'admin.users_protected':'Protegido','admin.users_last_admin':'Último admin',
        'admin.users_edit':'Editar usuario','admin.users_edit_title':'Editar usuario',
        'admin.users_username':'Nombre de usuario','admin.users_fleet_label':'Flota',
        'admin.users_email_ro':'Email (solo lectura)','admin.users_save':'Guardar cambios',
        'admin.users_promoted':'✓ Usuario promovido a administrador',
        'admin.users_role_updated':'✓ Rol de usuario actualizado',
        'admin.users_role_error':'✗ Error al actualizar el rol',
        'admin.users_protected_msg':'✗ El rol de este usuario está protegido y no puede modificarse.',
        'admin.users_confirm_admin':'¿Dar permisos de administrador a este usuario?',
        'admin.users_confirm_remove':'¿Quitar permisos de administrador a este usuario?',
        'admin.users_updated':'✓ Usuario actualizado','admin.users_update_error':'✗ Error al actualizar usuario',
        'admin.reports_title':'Reportes de Usuarios','admin.reports_empty':'No hay reportes pendientes.',
        'admin.reports_resolve':'Resolver','admin.reports_delete':'Eliminar',
        'admin.forum_title':'Gestión del Foro','admin.forum_new_cat':'Nueva Categoría',
        'admin.forum_cat_name':'Nombre de la categoría','admin.forum_cat_desc':'Descripción',
        'admin.forum_cat_icon':'Icono (emoji)','admin.forum_cat_order':'Orden',
        'admin.forum_save_cat':'Guardar categoría','admin.forum_no_cats':'No hay categorías creadas.',
        'admin.news_title':'Gestión de Noticias','admin.news_new':'Nueva Noticia',
        'admin.news_col_title':'Título','admin.news_col_date':'Fecha','admin.news_col_actions':'Acciones',
        'admin.news_no_news':'No hay noticias publicadas.','admin.news_form_title':'Título',
        'admin.news_form_content':'Contenido','admin.news_form_image':'URL de imagen',
        'admin.news_form_publish':'Publicar',
        'role.superadmin':'👑 Super Admin','role.admin':'Admin','role.user':'Usuario',
        'lang.name':'Español','lang.change':'Cambiar idioma',
        'enemies.page_title':'Enemigos y Drops',
        'missions.page_title':'Misiones e Historia',
        'misc.title':'Info & Guías',
        'calc.page_title':'Calculadora de costes',
        'maps.title':'Mapas Interactivos',
        'systems.page_title':'Sistemas y Planetas',
        'compare.title':'Comparador de Naves',
        'tracker.title':'Mi Colección de Planos',
        'blueprints.title':'Tracker de Planos',
        'conquest.title':'Planetas de Conquista',
        'systems.planets_subtitle':'Planetas de este sistema',
        'ships.subtitle':'Listado de naves de Pirate Galaxy. Filtra por nombre, tipo o facción. Las estadísticas de radar van de E (peor) a S (mejor).',
        'news.title':'Noticias',
    },

    // ════════════════════════════════════════════════════════════
    //  ENGLISH
    // ════════════════════════════════════════════════════════════
    en: {
        'nav.home':'Home','nav.ships':'Ships','nav.builds':'Builds','nav.components':'Components',
        'nav.enemies':'Enemies','nav.systems':'Systems','nav.planets':'Planets','nav.missions':'Missions',
        'nav.paints':'Paints','nav.drones':'Drones','nav.cortex':'Cortex','nav.gravitons':'Gravitons',
        'nav.misc':'Misc Info','nav.calculator':'Calculator','nav.forum':'Forum','nav.news':'News',
        'nav.compare':'Compare','nav.search':'Search...','nav.maps':'Maps',
        'auth.login':'Log in','auth.register':'Sign up','auth.logout':'Log out',
        'auth.back_home':'Back to home','auth.or_email':'or use your email',
        'auth.or_register':'or sign up with email','auth.email':'Email address',
        'auth.password':'Password','auth.forgot_pw':'Forgot your password?',
        'auth.no_account':'Don\'t have an account?','auth.has_account':'Already have an account?',
        'auth.sign_in_here':'Log in','auth.sign_up_here':'Sign up here',
        'auth.google':'Continue with Google','auth.creating':'Creating account...',
        'auth.login_required':'Log in',
        'register.title':'Create account','register.username':'Username',
        'register.fleet':'Fleet','register.fleet_optional':'(optional)',
        'register.confirm_password':'Confirm password','register.submit':'Create account',
        'register.google_warning':'Google sign-in requires an authorized domain. If you see an error, use email registration.',
        'profile.myprofile':'My Profile','profile.collection':'My Collection',
        'profile.favorites':'Favorites','profile.settings':'Settings','profile.admin':'Admin Panel',
        'profile.title':'My Profile','profile.subtitle':'Your GalaxWiki user profile.',
        'profile.loading':'Loading...','profile.login_needed':'You need to be registered to view your profile.',
        'profile.admin_badge':'Admin','profile.user_badge':'User','profile.no_fleet':'No fleet',
        'profile.server':'Server: ','profile.level':'Level ','profile.member_since':'Member since ',
        'profile.posts':'Posts','profile.xp':'Total XP','profile.no_items':'0 items saved.',
        'profile.tracker_hint':'Track the blueprints you\'ve already collected.',
        'profile.view_favs':'View favorites',
        'settings.subtitle':'Manage your account and preferences.',
        'settings.login_needed':'You need to be registered to change your settings.',
        'settings.avatar':'Profile picture','settings.avatar_hint':'PNG, JPG, WEBP or GIF · max 300 KB',
        'settings.processing':'Processing image...','settings.username':'Username',
        'settings.server':'Server','settings.server_select':'— Select server —',
        'settings.pilot_level':'Pilot level','settings.change_pw':'Change password',
        'settings.new_pw':'New password','settings.confirm_pw':'Confirm password',
        'settings.save':'Save changes','settings.saved':'✓ Changes saved',
        'ships.title':'Ships Database','ships.scale_label':'Stats scale:',
        'ships.grade_e':'E — Very low','ships.grade_d':'D — Low','ships.grade_c':'C — Medium',
        'ships.grade_b':'B — Good','ships.grade_a':'A — Very good','ships.grade_s':'S — Exceptional',
        'ships.filter_type':'Type: all','ships.filter_faction':'Faction: all',
        'ships.filter_level':'Required level: all','ships.compare':'Compare',
        'ships.load_more':'Load more...','ships.no_results':'No ships found with those filters.',
        'components.title':'Components','components.filter_type':'Type: all',
        'components.filter_rarity':'Rarity: all','components.filter_faction':'Faction: all',
        'components.no_results':'No components found.','components.load_more':'Load more...',
        'enemies.title':'Enemies','enemies.filter_type':'Type: all',
        'enemies.type_normal':'Normal','enemies.type_boss':'Boss','enemies.type_event':'Event',
        'enemies.type_mission':'Mission','enemies.filter_size':'Light','enemies.size_medium':'Medium',
        'enemies.size_heavy':'Heavy','enemies.filter_level':'Level: all',
        'enemies.col_name':'Name','enemies.col_level':'Level','enemies.col_type':'Type',
        'enemies.col_drops':'Drops','enemies.no_results':'No enemies registered yet.',
        'enemies.load_error':'Error loading enemies. Check console and Firestore rules.',
        'enemies.drops_label':'Drops:',
        'missions.title':'Missions','missions.no_results':'No missions registered yet.',
        'systems.title':'Star Systems','planets.title':'Planets',
        'forum.title':'Community Forum',
        'forum.subtitle':'Share strategies, ask for help and connect with other Pirate Galaxy players.',
        'forum.categories':'Categories','forum.threads':'Threads','forum.replies':'Replies',
        'forum.no_categories':'The forum has no categories yet.',
        'forum.admin_hint':'An admin can create them from the admin panel.',
        'forum.firebase_error':'Error: Firebase not initialized. Check the configuration.',
        'forum.new_thread':'New thread','forum.reply':'Reply','forum.post':'Post',
        'forum.login_to_post':'Log in to participate in the forum.',
        'news.subtitle':'Latest updates, events and news from Pirate Galaxy and the wiki.',
        'news.empty':'No news yet','news.empty_hint':'Published news will appear here.',
        'news.load_error':'Error loading news','news.retry':'Retry','news.read_more':'Read more',
        'search.title':'Global Search','search.placeholder':'Search across the wiki...',
        'search.no_results':'No results found. Try different keywords.',
        'favs.login_needed':'You need to be registered to save and view favorites.',
        'favs.filter_all':'All','favs.filter_paints':'Paints','favs.filter_drones':'Drones',
        'favs.filter_cortex':'Cortex','favs.filter_gravs':'Gravitons','favs.filter_planets':'Planets',
        'favs.empty':'You have no favorites in this category.','favs.remove':'Remove from favorites',
        'calc.title':'Calculator','calc.subtitle':'Calculate ship and component stats.',
        'footer.home':'Home','footer.ships':'Ships Database','footer.components':'Components',
        'footer.forum':'Community Forum','footer.about':'About the Game',
        'footer.quick_links':'Quick Links','footer.community':'Community',
        'footer.community_desc':'Join and contribute to the largest Pirate Galaxy database.',
        'footer.branding_desc':'The ultimate community encyclopedia. Find all information about ships, systems, and components to master the universe.',
        'footer.copyright':'GalaxWiki. An unofficial tool made by fans.',
        'footer.trademark':'"Pirate Galaxy" is a registered trademark of',
        'common.loading':'Loading...','common.error':'Error','common.save':'Save',
        'common.cancel':'Cancel','common.delete':'Delete','common.edit':'Edit',
        'common.add':'Add','common.search':'Search...','common.filter':'Filter',
        'common.all':'All','common.none':'None','common.yes':'Yes','common.no':'No',
        'common.confirm':'Confirm','common.close':'Close','common.back':'Back',
        'common.next':'Next','common.prev':'Previous','common.name':'Name',
        'common.level':'Level','common.type':'Type','common.faction':'Faction',
        'common.rarity':'Rarity','common.description':'Description','common.image':'Image',
        'common.required':'(required)','common.optional':'(optional)',
        'common.updated_at':'Updated: ','common.no_name':'No name','common.no_desc':'No description',
        'common.actions':'Actions','common.status':'Status','common.date':'Date',
        'common.created_at':'Created: ','common.by':'by',
        'hero.welcome':'Welcome to GalaxWiki',
        'hero.description':'The ultimate Pirate Galaxy encyclopedia. Find information about ships, components, enemies, missions and much more.',
        'hero.search_placeholder':'Search ships, components, enemies... (Ctrl+K)',
        'hero.stat_ships':'Ships','hero.stat_components':'Components',
        'hero.stat_enemies':'Enemies','hero.stat_users':'Users',
        'home.explore':'Explore the Wiki','home.featured':'Missions, News & Forum',
        'home.latest_news':'Latest news','home.news_error':'Could not load news.',
        'home.ships_title':'Ships Database','home.ships_desc':'Explore all ships available in Pirate Galaxy — stats, requirements and how to get them.',
        'home.components_title':'Components','home.components_desc':'Discover all components, attributes and how to upgrade your ship to the max.',
        'home.enemies_title':'Enemies & Drops','home.enemies_desc':'Information about enemies, drops and the best farming strategies.',
        'home.systems_title':'Universal Systems','home.systems_desc':'System maps, planets and sectors with available resources.',
        'home.missions_title':'Missions','home.missions_desc':'Mission guides, rewards and objectives. Plan your progress in the game.',
        'home.missions_cta':'View missions','home.news_title':'News',
        'home.news_desc':'Latest updates, events and game changes. Don\'t miss a thing.',
        'home.news_cta':'Read news','home.forum_title':'Forum',
        'home.forum_desc':'Share strategies, questions and connect with the player community.',
        'home.forum_cta':'Go to forum',
        'admin.panel_title':'Admin Panel',
        'admin.dashboard':'Dashboard','admin.users':'Users','admin.ships':'Ships',
        'admin.builds':'Builds','admin.components':'Components','admin.enemies':'Enemies',
        'admin.missions':'Missions','admin.game_story':'Game Story','admin.paints':'Paints',
        'admin.drones':'Drones','admin.cortex':'Cortex','admin.gravitons':'Gravitons',
        'admin.systems':'Systems','admin.planets':'Planets','admin.servers':'Servers',
        'admin.conquest':'Conquest by server','admin.news':'News','admin.forum':'Forum',
        'admin.misc_info':'Misc Info','admin.sirius':'Sirius Singularity',
        'admin.survival':'Survival Guides','admin.conquest_info':'Conquest Info',
        'admin.clan_info':'Clan Info','admin.reports':'Reports',
        'admin.factions':'Factions','admin.ship_types':'Ship types',
        'admin.component_types':'Weapon/component types','admin.component_rarities':'Weapon rarities',
        'admin.enemy_types':'Enemy types','admin.paint_types':'Paint types',
        'admin.paint_rarities':'Paint rarities','admin.drone_types':'Drone types',
        'admin.stat_users':'Users','admin.stat_ships':'Ships',
        'admin.stat_components':'Components','admin.stat_enemies':'Enemies',
        'admin.init_db':'Initialize collections','admin.back_site':'Back to site',
        'admin.users_title':'User Management',
        'admin.users_subtitle':'List of registered accounts. Only users with Admin role can access the panel and assign roles.',
        'admin.users_search':'Search by name, email or fleet...',
        'admin.users_col_user':'User','admin.users_col_email':'Email',
        'admin.users_col_fleet':'Fleet','admin.users_col_role':'Role','admin.users_col_actions':'Actions',
        'admin.users_loading':'Loading users...','admin.users_not_found':'No users found.',
        'admin.users_make_admin':'Make admin','admin.users_remove_admin':'Remove admin',
        'admin.users_protected':'Protected','admin.users_last_admin':'Last admin',
        'admin.users_edit':'Edit user','admin.users_edit_title':'Edit user',
        'admin.users_username':'Username','admin.users_fleet_label':'Fleet',
        'admin.users_email_ro':'Email (read-only)','admin.users_save':'Save changes',
        'admin.users_promoted':'✓ User promoted to administrator',
        'admin.users_role_updated':'✓ User role updated',
        'admin.users_role_error':'✗ Error updating role',
        'admin.users_protected_msg':'✗ This user\'s role is protected and cannot be changed.',
        'admin.users_confirm_admin':'Give administrator permissions to this user?',
        'admin.users_confirm_remove':'Remove administrator permissions from this user?',
        'admin.users_updated':'✓ User updated','admin.users_update_error':'✗ Error updating user',
        'admin.reports_title':'User Reports','admin.reports_empty':'No pending reports.',
        'admin.reports_resolve':'Resolve','admin.reports_delete':'Delete',
        'admin.forum_title':'Forum Management','admin.forum_new_cat':'New Category',
        'admin.forum_cat_name':'Category name','admin.forum_cat_desc':'Description',
        'admin.forum_cat_icon':'Icon (emoji)','admin.forum_cat_order':'Order',
        'admin.forum_save_cat':'Save category','admin.forum_no_cats':'No categories created.',
        'admin.news_title':'News Management','admin.news_new':'New Article',
        'admin.news_col_title':'Title','admin.news_col_date':'Date','admin.news_col_actions':'Actions',
        'admin.news_no_news':'No published news.','admin.news_form_title':'Title',
        'admin.news_form_content':'Content','admin.news_form_image':'Image URL',
        'admin.news_form_publish':'Publish',
        'role.superadmin':'👑 Super Admin','role.admin':'Admin','role.user':'User',
        'lang.name':'English','lang.change':'Change language',
        'enemies.page_title':'Enemies & Drops',
        'missions.page_title':'Missions & Story',
        'misc.title':'Info & Guides',
        'calc.page_title':'Cost Calculator',
        'maps.title':'Interactive Maps',
        'systems.page_title':'Systems & Planets',
        'compare.title':'Ship Comparator',
        'tracker.title':'My Blueprints Collection',
        'blueprints.title':'Blueprints Tracker',
        'conquest.title':'Conquest Planets',
        'systems.planets_subtitle':'Planets of this system',
        'ships.subtitle':'Pirate Galaxy ships listing. Filter by name, type or faction. Radar stats range from E (worst) to S (best).',
        'news.title':'News',
    },

    // ════════════════════════════════════════════════════════════
    //  DEUTSCH (Alemán)
    // ════════════════════════════════════════════════════════════
    de: {
        'nav.home':'Startseite','nav.ships':'Schiffe','nav.builds':'Builds','nav.components':'Komponenten',
        'nav.enemies':'Feinde','nav.systems':'Systeme','nav.planets':'Planeten','nav.missions':'Missionen',
        'nav.paints':'Lackierungen','nav.drones':'Drohnen','nav.cortex':'Cortex','nav.gravitons':'Gravitonen',
        'nav.misc':'Sonstiges','nav.calculator':'Rechner','nav.forum':'Forum','nav.news':'Neuigkeiten',
        'nav.compare':'Vergleichen','nav.search':'Suchen...','nav.maps':'Karten',
        'auth.login':'Anmelden','auth.register':'Registrieren','auth.logout':'Abmelden',
        'auth.back_home':'Zurück zur Startseite','auth.or_email':'oder verwende deine E-Mail',
        'auth.or_register':'oder registriere dich mit E-Mail','auth.email':'E-Mail-Adresse',
        'auth.password':'Passwort','auth.forgot_pw':'Passwort vergessen?',
        'auth.no_account':'Noch kein Konto?','auth.has_account':'Bereits ein Konto?',
        'auth.sign_in_here':'Anmelden','auth.sign_up_here':'Hier registrieren',
        'auth.google':'Weiter mit Google','auth.creating':'Konto wird erstellt...',
        'auth.login_required':'Anmelden',
        'register.title':'Konto erstellen','register.username':'Benutzername',
        'register.fleet':'Flotte','register.fleet_optional':'(optional)',
        'register.confirm_password':'Passwort bestätigen','register.submit':'Konto erstellen',
        'register.google_warning':'Die Anmeldung mit Google erfordert eine autorisierte Domain. Bei einem Fehler nutze die E-Mail-Registrierung.',
        'profile.myprofile':'Mein Profil','profile.collection':'Meine Sammlung',
        'profile.favorites':'Favoriten','profile.settings':'Einstellungen','profile.admin':'Admin-Panel',
        'profile.title':'Mein Profil','profile.subtitle':'Dein GalaxWiki-Benutzerprofil.',
        'profile.loading':'Laden...','profile.login_needed':'Du musst registriert sein, um dein Profil zu sehen.',
        'profile.admin_badge':'Admin','profile.user_badge':'Benutzer','profile.no_fleet':'Keine Flotte',
        'profile.server':'Server: ','profile.level':'Stufe ','profile.member_since':'Mitglied seit ',
        'profile.posts':'Beiträge','profile.xp':'Gesamt-XP','profile.no_items':'0 Elemente gespeichert.',
        'profile.tracker_hint':'Behalte den Überblick über deine gesammelten Baupläne.',
        'profile.view_favs':'Favoriten ansehen',
        'settings.subtitle':'Verwalte dein Konto und deine Einstellungen.',
        'settings.login_needed':'Du musst registriert sein, um deine Einstellungen zu ändern.',
        'settings.avatar':'Profilbild','settings.avatar_hint':'PNG, JPG, WEBP oder GIF · max. 300 KB',
        'settings.processing':'Bild wird verarbeitet...','settings.username':'Benutzername',
        'settings.server':'Server','settings.server_select':'— Server auswählen —',
        'settings.pilot_level':'Pilotenstufe','settings.change_pw':'Passwort ändern',
        'settings.new_pw':'Neues Passwort','settings.confirm_pw':'Passwort bestätigen',
        'settings.save':'Änderungen speichern','settings.saved':'✓ Änderungen gespeichert',
        'ships.title':'Schiffsdatenbank','ships.scale_label':'Statistik-Skala:',
        'ships.grade_e':'E — Sehr niedrig','ships.grade_d':'D — Niedrig','ships.grade_c':'C — Mittel',
        'ships.grade_b':'B — Gut','ships.grade_a':'A — Sehr gut','ships.grade_s':'S — Außergewöhnlich',
        'ships.filter_type':'Typ: alle','ships.filter_faction':'Fraktion: alle',
        'ships.filter_level':'Stufe erforderlich: alle','ships.compare':'Vergleichen',
        'ships.load_more':'Mehr laden...','ships.no_results':'Keine Schiffe mit diesen Filtern gefunden.',
        'components.title':'Komponenten','components.filter_type':'Typ: alle',
        'components.filter_rarity':'Seltenheit: alle','components.filter_faction':'Fraktion: alle',
        'components.no_results':'Keine Komponenten gefunden.','components.load_more':'Mehr laden...',
        'enemies.title':'Feinde','enemies.filter_type':'Typ: alle',
        'enemies.type_normal':'Normal','enemies.type_boss':'Boss','enemies.type_event':'Event',
        'enemies.type_mission':'Mission','enemies.filter_size':'Leicht','enemies.size_medium':'Mittel',
        'enemies.size_heavy':'Schwer','enemies.filter_level':'Stufe: alle',
        'enemies.col_name':'Name','enemies.col_level':'Stufe','enemies.col_type':'Typ',
        'enemies.col_drops':'Beute','enemies.no_results':'Noch keine Feinde registriert.',
        'enemies.load_error':'Fehler beim Laden der Feinde. Überprüfe die Konsole und die Firestore-Regeln.',
        'enemies.drops_label':'Beute:',
        'missions.title':'Missionen','missions.no_results':'Noch keine Missionen registriert.',
        'systems.title':'Sternensysteme','planets.title':'Planeten',
        'forum.title':'Community-Forum',
        'forum.subtitle':'Teile Strategien, bitte um Hilfe und verbinde dich mit anderen Pirate Galaxy Spielern.',
        'forum.categories':'Kategorien','forum.threads':'Themen','forum.replies':'Antworten',
        'forum.no_categories':'Das Forum hat noch keine Kategorien.',
        'forum.admin_hint':'Ein Administrator kann sie im Admin-Panel erstellen.',
        'forum.firebase_error':'Fehler: Firebase nicht initialisiert. Überprüfe die Konfiguration.',
        'forum.new_thread':'Neues Thema','forum.reply':'Antworten','forum.post':'Posten',
        'forum.login_to_post':'Melde dich an, um im Forum teilzunehmen.',
        'news.subtitle':'Neueste Updates, Events und Neuigkeiten von Pirate Galaxy und dem Wiki.',
        'news.empty':'Noch keine Neuigkeiten','news.empty_hint':'Veröffentlichte Neuigkeiten erscheinen hier.',
        'news.load_error':'Fehler beim Laden der Neuigkeiten','news.retry':'Erneut versuchen',
        'news.read_more':'Weiterlesen',
        'search.title':'Globale Suche','search.placeholder':'Im gesamten Wiki suchen...',
        'search.no_results':'Keine Ergebnisse gefunden. Versuche andere Suchbegriffe.',
        'favs.login_needed':'Du musst registriert sein, um Favoriten zu speichern und anzusehen.',
        'favs.filter_all':'Alle','favs.filter_paints':'Lackierungen','favs.filter_drones':'Drohnen',
        'favs.filter_cortex':'Cortex','favs.filter_gravs':'Gravitonen','favs.filter_planets':'Planeten',
        'favs.empty':'Du hast keine Favoriten in dieser Kategorie.','favs.remove':'Aus Favoriten entfernen',
        'calc.title':'Rechner','calc.subtitle':'Berechne Schiff- und Komponenten-Statistiken.',
        'footer.home':'Startseite','footer.ships':'Schiffsdatenbank','footer.components':'Komponenten',
        'footer.forum':'Community-Forum','footer.about':'Über das Spiel',
        'footer.quick_links':'Schnellzugriff','footer.community':'Community',
        'footer.community_desc':'Tritt bei und trage zur größten Pirate Galaxy Datenbank bei.',
        'footer.branding_desc':'Die ultimative Community-Enzyklopädie. Finde alle Informationen über Schiffe, Systeme und Komponenten, um das Universum zu beherrschen.',
        'footer.copyright':'GalaxWiki. Ein inoffizielles, von Fans erstelltes Tool.',
        'footer.trademark':'"Pirate Galaxy" ist eine eingetragene Marke von',
        'common.loading':'Laden...','common.error':'Fehler','common.save':'Speichern',
        'common.cancel':'Abbrechen','common.delete':'Löschen','common.edit':'Bearbeiten',
        'common.add':'Hinzufügen','common.search':'Suchen...','common.filter':'Filtern',
        'common.all':'Alle','common.none':'Keine','common.yes':'Ja','common.no':'Nein',
        'common.confirm':'Bestätigen','common.close':'Schließen','common.back':'Zurück',
        'common.next':'Weiter','common.prev':'Zurück','common.name':'Name',
        'common.level':'Stufe','common.type':'Typ','common.faction':'Fraktion',
        'common.rarity':'Seltenheit','common.description':'Beschreibung','common.image':'Bild',
        'common.required':'(erforderlich)','common.optional':'(optional)',
        'common.updated_at':'Aktualisiert: ','common.no_name':'Kein Name','common.no_desc':'Keine Beschreibung',
        'common.actions':'Aktionen','common.status':'Status','common.date':'Datum',
        'common.created_at':'Erstellt: ','common.by':'von',
        'hero.welcome':'Willkommen bei GalaxWiki',
        'hero.description':'Die ultimative Pirate Galaxy Enzyklopädie. Finde Informationen über Schiffe, Komponenten, Feinde, Missionen und vieles mehr.',
        'hero.search_placeholder':'Schiffe, Komponenten, Feinde suchen... (Strg+K)',
        'hero.stat_ships':'Schiffe','hero.stat_components':'Komponenten',
        'hero.stat_enemies':'Feinde','hero.stat_users':'Benutzer',
        'home.explore':'Wiki erkunden','home.featured':'Missionen, Neuigkeiten & Forum',
        'home.latest_news':'Neueste Nachrichten','home.news_error':'Neuigkeiten konnten nicht geladen werden.',
        'home.ships_title':'Schiffsdatenbank','home.ships_desc':'Erkunde alle verfügbaren Schiffe in Pirate Galaxy — Statistiken, Anforderungen und wie du sie bekommst.',
        'home.components_title':'Komponenten','home.components_desc':'Entdecke alle Komponenten, Attribute und wie du dein Schiff optimal aufrüstest.',
        'home.enemies_title':'Feinde & Beute','home.enemies_desc':'Informationen über Feinde, Beute und die besten Farm-Strategien.',
        'home.systems_title':'Universelle Systeme','home.systems_desc':'Systemkarten, Planeten und Sektoren mit verfügbaren Ressourcen.',
        'home.missions_title':'Missionen','home.missions_desc':'Missionsguides, Belohnungen und Ziele. Plane deinen Fortschritt im Spiel.',
        'home.missions_cta':'Missionen ansehen','home.news_title':'Neuigkeiten',
        'home.news_desc':'Neueste Updates, Events und Spieländerungen. Verpasse nichts.',
        'home.news_cta':'Neuigkeiten lesen','home.forum_title':'Forum',
        'home.forum_desc':'Teile Strategien, Fragen und verbinde dich mit der Spieler-Community.',
        'home.forum_cta':'Zum Forum',
        'admin.panel_title':'Admin-Panel',
        'admin.dashboard':'Dashboard','admin.users':'Benutzer','admin.ships':'Schiffe',
        'admin.builds':'Builds','admin.components':'Komponenten','admin.enemies':'Feinde',
        'admin.missions':'Missionen','admin.game_story':'Spielgeschichte','admin.paints':'Lackierungen',
        'admin.drones':'Drohnen','admin.cortex':'Cortex','admin.gravitons':'Gravitonen',
        'admin.systems':'Systeme','admin.planets':'Planeten','admin.servers':'Server',
        'admin.conquest':'Eroberung nach Server','admin.news':'Neuigkeiten','admin.forum':'Forum',
        'admin.misc_info':'Sonstiges','admin.sirius':'Sirius-Singularität',
        'admin.survival':'Überlebensguides','admin.conquest_info':'Eroberungsinfo',
        'admin.clan_info':'Clan-Info','admin.reports':'Berichte',
        'admin.factions':'Fraktionen','admin.ship_types':'Schiffstypen',
        'admin.component_types':'Waffen-/Komponententypen','admin.component_rarities':'Waffenseltenheiten',
        'admin.enemy_types':'Feindtypen','admin.paint_types':'Lackierungstypen',
        'admin.paint_rarities':'Lackierungsseltenheiten','admin.drone_types':'Drohnentypen',
        'admin.stat_users':'Benutzer','admin.stat_ships':'Schiffe',
        'admin.stat_components':'Komponenten','admin.stat_enemies':'Feinde',
        'admin.init_db':'Sammlungen initialisieren','admin.back_site':'Zurück zur Seite',
        'admin.users_title':'Benutzerverwaltung',
        'admin.users_subtitle':'Liste der registrierten Konten. Nur Benutzer mit Admin-Rolle können auf das Panel zugreifen und Rollen zuweisen.',
        'admin.users_search':'Nach Name, E-Mail oder Flotte suchen...',
        'admin.users_col_user':'Benutzer','admin.users_col_email':'E-Mail',
        'admin.users_col_fleet':'Flotte','admin.users_col_role':'Rolle','admin.users_col_actions':'Aktionen',
        'admin.users_loading':'Benutzer werden geladen...','admin.users_not_found':'Keine Benutzer gefunden.',
        'admin.users_make_admin':'Zum Admin machen','admin.users_remove_admin':'Admin entfernen',
        'admin.users_protected':'Geschützt','admin.users_last_admin':'Letzter Admin',
        'admin.users_edit':'Benutzer bearbeiten','admin.users_edit_title':'Benutzer bearbeiten',
        'admin.users_username':'Benutzername','admin.users_fleet_label':'Flotte',
        'admin.users_email_ro':'E-Mail (nur lesen)','admin.users_save':'Änderungen speichern',
        'admin.users_promoted':'✓ Benutzer zum Administrator befördert',
        'admin.users_role_updated':'✓ Benutzerrolle aktualisiert',
        'admin.users_role_error':'✗ Fehler beim Aktualisieren der Rolle',
        'admin.users_protected_msg':'✗ Die Rolle dieses Benutzers ist geschützt und kann nicht geändert werden.',
        'admin.users_confirm_admin':'Diesem Benutzer Admin-Rechte geben?',
        'admin.users_confirm_remove':'Admin-Rechte von diesem Benutzer entfernen?',
        'admin.users_updated':'✓ Benutzer aktualisiert','admin.users_update_error':'✗ Fehler beim Aktualisieren des Benutzers',
        'admin.reports_title':'Benutzerberichte','admin.reports_empty':'Keine ausstehenden Berichte.',
        'admin.reports_resolve':'Lösen','admin.reports_delete':'Löschen',
        'admin.forum_title':'Forum-Verwaltung','admin.forum_new_cat':'Neue Kategorie',
        'admin.forum_cat_name':'Kategoriename','admin.forum_cat_desc':'Beschreibung',
        'admin.forum_cat_icon':'Symbol (Emoji)','admin.forum_cat_order':'Reihenfolge',
        'admin.forum_save_cat':'Kategorie speichern','admin.forum_no_cats':'Keine Kategorien erstellt.',
        'admin.news_title':'Nachrichten-Verwaltung','admin.news_new':'Neuer Artikel',
        'admin.news_col_title':'Titel','admin.news_col_date':'Datum','admin.news_col_actions':'Aktionen',
        'admin.news_no_news':'Keine veröffentlichten Nachrichten.','admin.news_form_title':'Titel',
        'admin.news_form_content':'Inhalt','admin.news_form_image':'Bild-URL',
        'admin.news_form_publish':'Veröffentlichen',
        'role.superadmin':'👑 Super Admin','role.admin':'Admin','role.user':'Benutzer',
        'lang.name':'Deutsch','lang.change':'Sprache ändern',
        'enemies.page_title':'Feinde & Drops',
        'missions.page_title':'Missionen & Geschichte',
        'misc.title':'Info & Anleitungen',
        'calc.page_title':'Kostenrechner',
        'maps.title':'Interaktive Karten',
        'systems.page_title':'Systeme & Planeten',
        'compare.title':'Schiffsvergleich',
        'tracker.title':'Meine Blaupausen-Sammlung',
        'blueprints.title':'Blaupausen-Tracker',
        'conquest.title':'Eroberungsplaneten',
        'systems.planets_subtitle':'Planeten dieses Systems',
        'ships.subtitle':'Pirate Galaxy Schiffsliste. Filtern nach Name, Typ oder Fraktion. Radarwerte reichen von E (schlechteste) bis S (beste).',
        'news.title':'Neuigkeiten',
    }
};

// ── Idiomas disponibles (orden de rotación) ──────────────────────
const LANG_ORDER = ['es', 'en', 'de'];
const LANG_FLAGS = { es: '🇪🇸', en: '🇬🇧', de: '🇩🇪' };
const LANG_LABELS = { es: 'Español', en: 'English', de: 'Deutsch' };

// ── Estado ───────────────────────────────────────────────────────
let currentLang = localStorage.getItem('appLang') || 'es';
if (!translations[currentLang]) currentLang = 'es';

// ── API pública ──────────────────────────────────────────────────
window.setLanguage = function(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('appLang', lang);
    document.documentElement.setAttribute('lang', lang);
    autoTagNavAndTitles();
    applyTranslations();
    updateLangToggleUI();
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
};

window.toggleLanguage = function() {
    var idx = LANG_ORDER.indexOf(currentLang);
    var next = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
    window.setLanguage(next);
};

/** t('key') — obtiene traducción directo en JS */
window.t = function(key, fallback) {
    return (translations[currentLang] && translations[currentLang][key])
        ? translations[currentLang][key]
        : (translations['es'][key] || fallback || key);
};

window.getCurrentLang = function() { return currentLang; };

// ── Mapa de texto español → clave i18n ──────────────────────────
const TEXT_TO_KEY = {
    'Inicio':'nav.home','Home':'nav.home','Startseite':'nav.home',
    'Naves':'nav.ships','Ships':'nav.ships','Schiffe':'nav.ships',
    'Builds':'nav.builds',
    'Componentes':'nav.components','Components':'nav.components','Komponenten':'nav.components',
    'Enemigos':'nav.enemies','Enemies':'nav.enemies','Feinde':'nav.enemies',
    'Sistemas':'nav.systems','Systems':'nav.systems','Systeme':'nav.systems',
    'Planetas':'nav.planets','Planets':'nav.planets','Planeten':'nav.planets',
    'Misiones':'nav.missions','Missions':'nav.missions','Missionen':'nav.missions',
    'Misc Info':'nav.misc','Sonstiges':'nav.misc',
    'Calculadora':'nav.calculator','Calculator':'nav.calculator','Rechner':'nav.calculator',
    'Foro':'nav.forum','Forum':'nav.forum',
    'Noticias':'nav.news','News':'nav.news','Neuigkeiten':'nav.news',
    'Mapas':'nav.maps','Maps':'nav.maps','Karten':'nav.maps',
    'Pinturas':'nav.paints','Paints':'nav.paints','Lackierungen':'nav.paints',
    'Drones':'nav.drones','Drohnen':'nav.drones',
    'Cortex':'nav.cortex',
    'Gravitones':'nav.gravitons','Gravitons':'nav.gravitons','Gravitonen':'nav.gravitons',
    'Comparar':'nav.compare','Compare':'nav.compare','Vergleichen':'nav.compare',
    'Base de Naves':'ships.title','Ships Database':'ships.title','Schiffsdatenbank':'ships.title',
    'Escala de estadísticas:':'ships.scale_label',
    'E — Muy bajo':'ships.grade_e','D — Bajo':'ships.grade_d','C — Medio':'ships.grade_c',
    'B — Bueno':'ships.grade_b','A — Muy bueno':'ships.grade_a','S — Excepcional':'ships.grade_s',
    'Tipo: todos':'ships.filter_type','Facción: todas':'ships.filter_faction',
    'Nivel requerido: todos':'ships.filter_level',
    'Cargar más...':'ships.load_more','Load more...':'ships.load_more','Mehr laden...':'ships.load_more',
    'No se encontraron naves con esos filtros.':'ships.no_results',
    'Sistemas Estelares':'systems.title','Star Systems':'systems.title','Sternensysteme':'systems.title',
    'Iniciar sesión':'auth.login','Log in':'auth.login','Anmelden':'auth.login',
    'Registrarse':'auth.register','Sign up':'auth.register','Registrieren':'auth.register',
    'Entrar':'auth.login',
    'Registro':'auth.register',
    'Mi Perfil':'profile.myprofile','My Profile':'profile.myprofile','Mein Profil':'profile.myprofile',
    'Mi Colección':'profile.collection','My Collection':'profile.collection','Meine Sammlung':'profile.collection',
    'Favoritos':'profile.favorites','Favorites':'profile.favorites','Favoriten':'profile.favorites',
    'Configuración':'profile.settings','Settings':'profile.settings','Einstellungen':'profile.settings',
    'Panel Admin':'profile.admin','Admin Panel':'profile.admin','Admin-Panel':'profile.admin',
    'Cerrar sesión':'auth.logout','Log out':'auth.logout','Abmelden':'auth.logout',
    'Foro Comunitario':'forum.title','Community Forum':'forum.title','Community-Forum':'forum.title',
    'Búsqueda Global':'search.title','Global Search':'search.title','Globale Suche':'search.title',
    // Page titles
    'Componentes':'components.title','Components':'components.title','Komponenten':'components.title',
    'Enemigos y Drops':'enemies.page_title','Enemies & Drops':'enemies.page_title','Feinde & Drops':'enemies.page_title',
    'Misiones e Historia':'missions.page_title','Missions & Story':'missions.page_title','Missionen & Geschichte':'missions.page_title',
    'Info & Guías':'misc.title','Info & Guides':'misc.title','Info & Anleitungen':'misc.title',
    'Calculadora de costes':'calc.page_title','Cost Calculator':'calc.page_title','Kostenrechner':'calc.page_title',
    'Mapas Interactivos':'maps.title','Interactive Maps':'maps.title','Interaktive Karten':'maps.title',
    'Sistemas y Planetas':'systems.page_title','Systems & Planets':'systems.page_title','Systeme & Planeten':'systems.page_title',
    'Comparador de Naves':'compare.title','Ship Comparator':'compare.title','Schiffsvergleich':'compare.title',
    'Mi Colección de Planos':'tracker.title','My Blueprints Collection':'tracker.title','Meine Blaupausen-Sammlung':'tracker.title',
    'Tracker de Planos':'blueprints.title','Blueprints Tracker':'blueprints.title','Blaupausen-Tracker':'blueprints.title',
    'Planetas de Conquista':'conquest.title','Conquest Planets':'conquest.title','Eroberungsplaneten':'conquest.title',
    'Planetas de este sistema':'systems.planets_subtitle','Planets of this system':'systems.planets_subtitle','Planeten dieses Systems':'systems.planets_subtitle',
    // Subtitles
    'Listado de naves de Pirate Galaxy. Filtra por nombre, tipo o facción. Las estadísticas de radar van de E (peor) a S (mejor).':'ships.subtitle',
    // News page
    'Noticias':'news.title','Neuigkeiten':'news.title',
    'Últimas actualizaciones, eventos y novedades de Pirate Galaxy y la wiki.':'news.subtitle',
    // Forum
    'Comparte estrategias, pide ayuda y conecta con otros jugadores de Pirate Galaxy.':'forum.subtitle',
    // Search
    'Busca en toda la wiki...':'search.placeholder',
};

// ── Auto-tag nav links, titles, buttons ─────────────────────────
function autoTagNavAndTitles() {
    // Nav links
    document.querySelectorAll('.nav-link, .nav-item a').forEach(el => {
        if (el.hasAttribute('data-i18n')) return;
        var txt = el.textContent.trim();
        for (var key in TEXT_TO_KEY) {
            if (txt === key || txt.replace(/^\s+/, '') === key) {
                el.setAttribute('data-i18n', TEXT_TO_KEY[key]);
                break;
            }
        }
    });

    // Page titles
    document.querySelectorAll('.page-title, h1.page-title').forEach(el => {
        if (el.hasAttribute('data-i18n')) return;
        var txt = el.textContent.trim();
        for (var key in TEXT_TO_KEY) {
            if (txt === key || txt.includes(key)) {
                el.setAttribute('data-i18n', TEXT_TO_KEY[key]);
                break;
            }
        }
    });

    // Dropdown menu items (profile, admin)
    document.querySelectorAll('.dropdown-item').forEach(el => {
        if (el.hasAttribute('data-i18n') || el.querySelector('[data-i18n]')) return;
        var txt = el.textContent.trim();
        for (var key in TEXT_TO_KEY) {
            if (txt === key) {
                el.setAttribute('data-i18n', TEXT_TO_KEY[key]);
                break;
            }
        }
    });

    // Filter selects (first option)
    document.querySelectorAll('.filter-select option:first-child').forEach(el => {
        if (el.hasAttribute('data-i18n')) return;
        var txt = el.textContent.trim();
        for (var key in TEXT_TO_KEY) {
            if (txt === key) {
                el.setAttribute('data-i18n', TEXT_TO_KEY[key]);
                break;
            }
        }
    });

    // Auth buttons
    document.querySelectorAll('.btn-login, .btn-register, .gw-btn-login, .gw-btn-register, .gw-auth-btn').forEach(el => {
        if (el.hasAttribute('data-i18n') || el.querySelector('[data-i18n]')) return;
        var txt = el.textContent.trim();
        for (var key in TEXT_TO_KEY) {
            if (txt === key) {
                el.setAttribute('data-i18n', TEXT_TO_KEY[key]);
                break;
            }
        }
    });

    // Empty state messages, load more buttons
    document.querySelectorAll('#emptyState, #loadMoreBtn, .empty-state, .btn-secondary').forEach(el => {
        if (el.hasAttribute('data-i18n')) return;
        var txt = el.textContent.trim();
        for (var key in TEXT_TO_KEY) {
            if (txt === key || txt.includes(key)) {
                el.setAttribute('data-i18n', TEXT_TO_KEY[key]);
                break;
            }
        }
    });

    // Stat scale labels
    document.querySelectorAll('[style*="font-weight: 700"], [style*="font-weight:700"]').forEach(el => {
        if (el.hasAttribute('data-i18n') || el.children.length > 0) return;
        var txt = el.textContent.trim();
        if (TEXT_TO_KEY[txt]) {
            el.setAttribute('data-i18n', TEXT_TO_KEY[txt]);
        }
    });

    // Page subtitles
    document.querySelectorAll('.page-subtitle, p.page-subtitle').forEach(el => {
        if (el.hasAttribute('data-i18n')) return;
        var txt = el.textContent.trim();
        for (var key in TEXT_TO_KEY) {
            if (txt === key) {
                el.setAttribute('data-i18n', TEXT_TO_KEY[key]);
                break;
            }
        }
    });

    // Search inputs on sub-pages
    document.querySelectorAll('.search-input, input[type="text"][id="searchInput"]').forEach(el => {
        if (el.hasAttribute('data-i18n-placeholder')) return;
        var ph = (el.placeholder || '').trim();
        if (ph && TEXT_TO_KEY[ph]) {
            el.setAttribute('data-i18n-placeholder', TEXT_TO_KEY[ph]);
        }
    });

    // Scale stat label (the span with icon + text)
    document.querySelectorAll('[style*="font-weight: 600"]').forEach(el => {
        if (el.hasAttribute('data-i18n') || el.children.length > 1) return;
        var txt = el.textContent.trim();
        if (TEXT_TO_KEY[txt]) {
            el.setAttribute('data-i18n', TEXT_TO_KEY[txt]);
        }
    });
}

// ── Aplicar traducciones al DOM ──────────────────────────────────
function applyTranslations() {
    const lang = translations[currentLang] || translations['es'];

    // data-i18n → textContent (conserva icono <i> si existe)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const text = lang[el.getAttribute('data-i18n')];
        if (!text) return;
        const icon = el.querySelector('i');
        if (icon) {
            const cloned = icon.cloneNode(true);
            el.textContent = ' ' + text;
            el.prepend(cloned);
        } else {
            el.textContent = text;
        }
    });

    // data-i18n-placeholder → placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const text = lang[el.getAttribute('data-i18n-placeholder')];
        if (text) el.placeholder = text;
    });

    // data-i18n-title → atributo title (tooltip)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const text = lang[el.getAttribute('data-i18n-title')];
        if (text) el.title = text;
    });

    // data-i18n-html → innerHTML (contenido con etiquetas)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const text = lang[el.getAttribute('data-i18n-html')];
        if (text) el.innerHTML = text;
    });
}

function updateLangToggleUI() {
    // Actualizar texto del botón principal
    var btn = document.getElementById('langToggleText');
    if (btn) btn.textContent = LANG_FLAGS[currentLang] + ' ' + currentLang.toUpperCase();

    // Actualizar dropdown items
    document.querySelectorAll('[data-lang-option]').forEach(el => {
        var lang = el.getAttribute('data-lang-option');
        el.classList.toggle('gw-lang-active', lang === currentLang);
    });

    document.querySelectorAll('[data-lang-active]').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-lang-active') === currentLang);
    });
}

// ── Inicialización ───────────────────────────────────────────────
window.applyTranslations = applyTranslations; // expose for web-components

function _initI18n() {
    document.documentElement.setAttribute('lang', currentLang);
    // First pass (immediate / 120ms)
    setTimeout(() => { autoTagNavAndTitles(); applyTranslations(); updateLangToggleUI(); }, 120);
    // Second pass to catch dynamically injected elements (header-auth, footer, etc.)
    setTimeout(() => { autoTagNavAndTitles(); applyTranslations(); updateLangToggleUI(); }, 800);
    // Third pass for very late elements (chat widget, complex pages)
    setTimeout(() => { autoTagNavAndTitles(); applyTranslations(); updateLangToggleUI(); }, 1500);
}

// Handle both sync loading (script in HTML) and async loading (injected by header-auth.js)
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', _initI18n);
} else {
    // DOM already loaded — i18n.js was injected dynamically, run immediately
    _initI18n();
}