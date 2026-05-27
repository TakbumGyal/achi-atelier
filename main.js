/* ===== JAVASCRIPT ===== */

/* ─── TRANSLATIONS ─── */
const TRANS = {
  fr: {
    loader_sub:'Nail Studio · Paris 11',
    nav_about:'À propos', nav_services:'Soins', nav_gallery:'Galerie', nav_contact:'Contact', nav_book:'Réserver',
    hero_eyebrow:'Nail Studio · Paris 11ème',
    hero_h1:'Là où chaque main<br>raconte une <em>belle histoire</em>',
    hero_sub:'Entrez dans un univers d\'artisanat délicat et de relaxation totale. Chez Atelier Achi, nous transformons vos ongles en petits chefs-d\'œuvre — avec soin, passion et précision parisienne.',
    hero_cta1:'Réserver maintenant', hero_cta2:'Voir nos soins',
    stat1:'Clientes satisfaites', stat2:'Ans d\'expertise', stat3:'Créations uniques',
    badge_rating:'Note clients', badge_tag:'Savoir-faire Parisien',
    about_eyebrow:'Notre histoire',
    about_h2:'Façonné avec <em>Passion</em>,<br>livré avec Soin',
    about_p1:'Atelier Achi est bien plus qu\'un salon de beauté — c\'est votre sanctuaire personnel. Niché au cœur du 11ème arrondissement de Paris, nous allions artisanat expert et chaleur humaine pour créer une expérience aussi belle que le résultat.',
    about_p2:'Qu\'il s\'agisse d\'une finition minimaliste ou d\'un nail art élaboré, chaque soin est pensé pour vous — avec les meilleurs produits et une attention méticuleuse aux moindres détails.',
    val1:'Produits Premium', val2:'Hygiène irréprochable', val3:'Sur-mesure', val4:'Savoir-faire Parisien',
    about_lbl1:'Artisanat', about_lbl2:'Notre Atelier', about_lbl3:'L\'Expérience', about_pill:'Ans',
    svc_tag:'Nos prestations', svc_h2:'Des soins pensés <em>pour vous</em>',
    svc_sub:'Chaque prestation est conçue pour révéler votre beauté naturelle, avec des produits qui nourrissent autant qu\'ils transforment.',
    tab_ongles:'💅 Ongles', tab_epil:'🌸 Épilation',
    cat_mani:'Les Manucures', cat_pieds:'Beauté des pieds', cat_complet:'Soins mains & pieds',
    cat_pose:'Pose & Renforcement', cat_suppl:'À la carte — Suppléments',
    cat_visage:'Visage', cat_haut:'Haut du corps', cat_bas:'Bas du corps', cat_forfait:'Forfaits épilation',
    price_devis:'Sur devis',
    suppl_note:'Les suppléments s\'ajoutent au tarif de la prestation principale · Designs et nail art : tarif établi lors du rendez-vous',
    gal_tag:'Inspiration', gal_h2:'Un aperçu de <em>notre travail</em>',
    gal_sub:'Chaque soin est unique. Découvrez quelques-unes de nos créations favorites.',
    gal_lbl1:'Nail Art Signature', gal_lbl2:'Manucure Classique', gal_lbl3:'Pose de Gel', gal_lbl4:'Manucure Spa', gal_lbl5:'Soin des Pieds',
    testi_tag:'Avis clients', testi_h2:'Ce que disent <em>nos clientes</em>',
    testi1:'"Atelier Achi a complètement transformé mon rapport aux ongles. L\'attention aux détails est remarquable — je repars toujours enchantée. Une expérience de luxe à Paris 11."',
    testi2:'"La réservation en ligne est si simple, le salon est magnifique, et mes ongles ont tenu 4 semaines impeccablement. Je recommande Atelier Achi à toutes mes amies !"',
    testi3:'"Le meilleur nail studio de Paris, sans hésitation. Les créations nail art sont stupéfiantes — elles ont transformé mon idée en quelque chose d\'encore plus beau."',
    cliente_depuis:'Cliente depuis 2022', cliente_depuis2:'Cliente depuis 2023', cliente_depuis3:'Cliente depuis 2021',
    hours1_title:'Mardi – Vendredi', hours1_time:'10h00 – 20h00',
    hours2_title:'Samedi – Dimanche', hours2_time:'10h00 – 20h00',
    hours3_title:'Lundi', hours3_time:'Fermé',
    hours4_title:'Sans rendez-vous', hours4_time:'Sur disponibilité',
    contact_eyebrow:'Nous trouver', contact_h2:'Venez nous <em>rendre visite</em>',
    c_address_lbl:'Adresse', c_phone_lbl:'Téléphone', c_email_lbl:'Email',
    contact_book_btn:'Réserver un soin',
    bk_tag:'Réservation', bk_h2:'Réservez votre <em>moment</em>',
    bkt_client:'Prendre rendez-vous', bkt_admin:'Espace Admin',
    step1:'Prestation', step2:'Date & heure', step3:'Vos infos', step4:'Confirmer',
    st1_intro:'Choisissez votre prestation pour commencer :',
    btn_next:'Suivant →', btn_back:'← Retour', btn_review:'Récapitulatif →', btn_cancel:'Annuler',
    lbl_fn:'Prénom *', lbl_ln:'Nom *', lbl_em:'Email *', lbl_ph:'Téléphone (optionnel)', lbl_msg:'Demande particulière (optionnel)',
    err_name:'Lettres uniquement', err_email:'Email invalide', err_phone:'Chiffres uniquement · 10–15 chiffres',
    admin_login_title:'Espace Administrateur', admin_login_sub:'Entrez votre mot de passe pour accéder au tableau de bord.',
    admin_login_btn:'Connexion', admin_err:'Mot de passe incorrect', admin_logout:'Déconnexion',
    admin_add:'+ Ajouter', admin_upcoming:'À venir',
    modal_title:'Ajouter un rendez-vous', modal_svc:'Prestation *', modal_date:'Date *', modal_time:'Heure *',
    modal_fn:'Prénom *', modal_ln:'Nom *', modal_note:'Note (optionnel)', modal_save:'Enregistrer',
    f_nav:'Navigation', f_services:'Prestations', f_contact:'Contact',
    footer_sub:'Votre sanctuaire de beauté au cœur de Paris 11ème. Nous créons plus que des ongles — nous créons de la confiance.',
    footer_rights:'Tous droits réservés.', footer_made:'Fait avec 💗 à Paris',
    confirm_title:'Récapitulatif de votre rendez-vous', confirm_sub:'Veuillez vérifier vos informations avant de confirmer.',
    tbl_svc:'Prestation', tbl_dur:'Durée', tbl_price:'Prix', tbl_date:'Date', tbl_time:'Heure', tbl_name:'Nom', tbl_email:'Email', tbl_phone:'Téléphone', tbl_msg:'Demande',
    btn_edit:'← Modifier', btn_confirm:'✓ Confirmer',
    success_title:'Rendez-vous confirmé !', success_sub:'Merci {name} ! Votre {svc} est réservé pour le {date} à {time}.<br>Nous avons hâte de vous accueillir ! 💅<br><span style="font-size:.78rem;opacity:.8">Besoin d\'annuler ? Contactez-nous sur WhatsApp ou Instagram.</span>',
    btn_another:'Prendre un autre rendez-vous',
    slots_lbl:'Créneaux disponibles — {date} :',
    closed_today:'Le salon est fermé à cette heure. Prochain créneau disponible demain.',
    closed_tonight:'🌙 Le salon est fermé pour ce soir.',
    next_avail_prefix:'Prochain jour disponible :',
    slots_word:'créneaux',
    day_closed:'Le salon est fermé le lundi.',
    no_slots:'Aucun créneau disponible ce jour.',
    month_abbr:['jan.','fév.','mars','avr.','mai','juin','juil.','août','sep.','oct.','nov.','déc.'],
  },
  en: {
    loader_sub:'Nail Studio · Paris 11',
    nav_about:'About', nav_services:'Services', nav_gallery:'Gallery', nav_contact:'Contact', nav_book:'Book',
    hero_eyebrow:'Nail Studio · Paris 11th',
    hero_h1:'Where every hand<br>tells a <em>beautiful story</em>',
    hero_sub:'Step into a world of delicate artistry and pure relaxation. At Achi Atelier, we transform your nails into tiny masterpieces — crafted with care, passion and Parisian precision.',
    hero_cta1:'Book now', hero_cta2:'View our services',
    stat1:'Happy clients', stat2:'Years of expertise', stat3:'Unique creations',
    badge_rating:'Client rating', badge_tag:'Parisian Craftsmanship',
    about_eyebrow:'Our story',
    about_h2:'Crafted with <em>Passion</em>,<br>delivered with Care',
    about_p1:'Achi Atelier is more than a beauty salon — it\'s your personal sanctuary. Nestled in the heart of Paris 11th, we combine expert craftsmanship and genuine warmth to create an experience as beautiful as the result.',
    about_p2:'Whether you seek a minimalist finish or elaborate nail art, every treatment is tailored to you — with the finest products and meticulous attention to every detail.',
    val1:'Premium Products', val2:'Impeccable Hygiene', val3:'Bespoke', val4:'Parisian Expertise',
    about_lbl1:'Craftsmanship', about_lbl2:'Our Studio', about_lbl3:'The Experience', about_pill:'Years',
    svc_tag:'Our services', svc_h2:'Treatments made <em>for you</em>',
    svc_sub:'Each service is designed to reveal your natural beauty, with products that nourish as much as they transform.',
    tab_ongles:'💅 Nails', tab_epil:'🌸 Waxing',
    cat_mani:'Manicures', cat_pieds:'Pedicures', cat_complet:'Hands & Feet treatments',
    cat_pose:'Nail extensions', cat_suppl:'À la carte — Add-ons',
    cat_visage:'Face', cat_haut:'Upper body', cat_bas:'Lower body', cat_forfait:'Waxing packages',
    price_devis:'On request',
    suppl_note:'Add-ons are applied on top of the main service price · Nail art designs: price agreed at appointment',
    gal_tag:'Inspiration', gal_h2:'A glimpse of <em>our work</em>',
    gal_sub:'Every treatment is unique. Browse some of our favourite creations.',
    gal_lbl1:'Signature Nail Art', gal_lbl2:'Classic Manicure', gal_lbl3:'Gel Extension', gal_lbl4:'Spa Manicure', gal_lbl5:'Pedicure',
    testi_tag:'Client reviews', testi_h2:'What our <em>clients say</em>',
    testi1:'"Achi Atelier completely changed my relationship with nail care. The attention to detail is remarkable — I always leave delighted. A luxury experience in Paris 11."',
    testi2:'"Booking online is so easy, the salon is beautiful, and my nails lasted 4 weeks perfectly. I recommend Achi Atelier to all my friends!"',
    testi3:'"The best nail studio in Paris, without hesitation. The nail art creations are stunning — they turned my idea into something even more beautiful."',
    cliente_depuis:'Client since 2022', cliente_desde2:'Client since 2023', cliente_depuis3:'Client since 2021',
    hours1_title:'Tuesday – Friday', hours1_time:'10 AM – 8 PM',
    hours2_title:'Saturday – Sunday', hours2_time:'10 AM – 8 PM',
    hours3_title:'Monday', hours3_time:'Closed',
    hours4_title:'Walk-ins', hours4_time:'Subject to availability',
    contact_eyebrow:'Find us', contact_h2:'Come and <em>visit us</em>',
    c_address_lbl:'Address', c_phone_lbl:'Phone', c_email_lbl:'Email',
    contact_book_btn:'Book a treatment',
    bk_tag:'Booking', bk_h2:'Book your <em>moment</em>',
    bkt_client:'Make an appointment', bkt_admin:'Admin panel',
    step1:'Service', step2:'Date & time', step3:'Your info', step4:'Confirm',
    st1_intro:'Choose your service to get started:',
    btn_next:'Next →', btn_back:'← Back', btn_review:'Review →', btn_cancel:'Cancel',
    lbl_fn:'First name *', lbl_ln:'Last name *', lbl_em:'Email *', lbl_ph:'Phone (optional)', lbl_msg:'Special request (optional)',
    err_name:'Letters only', err_email:'Invalid email', err_phone:'Numbers only · 10–15 digits',
    admin_login_title:'Admin Panel', admin_login_sub:'Enter your password to access the dashboard.',
    admin_login_btn:'Log in', admin_err:'Incorrect password', admin_logout:'Log out',
    admin_add:'+ Add', admin_upcoming:'Upcoming',
    modal_title:'Add appointment', modal_svc:'Service *', modal_date:'Date *', modal_time:'Time *',
    modal_fn:'First name *', modal_ln:'Last name *', modal_note:'Note (optional)', modal_save:'Save',
    f_nav:'Navigation', f_services:'Services', f_contact:'Contact',
    footer_sub:'Your beauty sanctuary in the heart of Paris 11th. We create more than nails — we create confidence.',
    footer_rights:'All rights reserved.', footer_made:'Made with 💗 in Paris',
    confirm_title:'Appointment summary', confirm_sub:'Please check your details before confirming.',
    tbl_svc:'Service', tbl_dur:'Duration', tbl_price:'Price', tbl_date:'Date', tbl_time:'Time', tbl_name:'Name', tbl_email:'Email', tbl_phone:'Phone', tbl_msg:'Request',
    btn_edit:'← Edit', btn_confirm:'✓ Confirm',
    success_title:'Appointment confirmed!', success_sub:'Thank you {name}! Your {svc} is booked for {date} at {time}.<br>We look forward to welcoming you! 💅<br><span style="font-size:.78rem;opacity:.8">Need to cancel? Contact us on WhatsApp or Instagram.</span>',
    btn_another:'Book another appointment',
    slots_lbl:'Available times — {date}:',
    closed_today:'The salon is closed at this time. Next available slot from tomorrow.',
    closed_tonight:'🌙 The salon is closed for tonight.',
    next_avail_prefix:'Next available day:',
    slots_word:'slots',
    day_closed:'The salon is closed on Mondays.',
    no_slots:'No slots available for this day.',
    cliente_depuis2:'Client since 2023',
    month_abbr:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  },
  es: {
    loader_sub:'Nail Studio · Paris 11',
    nav_about:'Sobre nosotros', nav_services:'Servicios', nav_gallery:'Galería', nav_contact:'Contacto', nav_book:'Reservar',
    hero_eyebrow:'Nail Studio · París 11',
    hero_h1:'Donde cada mano<br>cuenta una <em>bella historia</em>',
    hero_sub:'Entra en un mundo de artesanía delicada y relajación total. En Achi Atelier, transformamos tus uñas en pequeñas obras de arte — con cuidado, pasión y precisión parisina.',
    hero_cta1:'Reservar ahora', hero_cta2:'Ver nuestros servicios',
    stat1:'Clientas satisfechas', stat2:'Años de experiencia', stat3:'Creaciones únicas',
    badge_rating:'Valoración clientes', badge_tag:'Artesanía Parisina',
    about_eyebrow:'Nuestra historia',
    about_h2:'Creado con <em>Pasión</em>,<br>entregado con Cuidado',
    about_p1:'Achi Atelier es mucho más que un salón de belleza — es tu santuario personal. Situado en el corazón del barrio 11 de París, combinamos artesanía experta y calidez humana.',
    about_p2:'Ya sea un acabado minimalista o un nail art elaborado, cada tratamiento está pensado para ti — con los mejores productos y atención meticulosa a cada detalle.',
    val1:'Productos Premium', val2:'Higiene impecable', val3:'A medida', val4:'Saber hacer Parisino',
    about_lbl1:'Artesanía', about_lbl2:'Nuestro Atelier', about_lbl3:'La Experiencia', about_pill:'Años',
    svc_tag:'Nuestros servicios', svc_h2:'Tratamientos pensados <em>para ti</em>',
    svc_sub:'Cada servicio está diseñado para revelar tu belleza natural, con productos que nutren tanto como transforman.',
    tab_ongles:'💅 Uñas', tab_epil:'🌸 Depilación',
    cat_mani:'Manicuras', cat_pieds:'Pedicuras', cat_complet:'Tratamientos manos y pies',
    cat_pose:'Extensiones de uñas', cat_suppl:'À la carte — Complementos',
    cat_visage:'Rostro', cat_haut:'Parte superior del cuerpo', cat_bas:'Parte inferior del cuerpo', cat_forfait:'Paquetes de depilación',
    price_devis:'A consultar',
    suppl_note:'Los complementos se añaden al precio del servicio principal · Diseños nail art: precio acordado en la cita',
    gal_tag:'Inspiración', gal_h2:'Una muestra de <em>nuestro trabajo</em>',
    gal_sub:'Cada tratamiento es único. Descubre algunas de nuestras creaciones favoritas.',
    gal_lbl1:'Nail Art Signature', gal_lbl2:'Manicura Clásica', gal_lbl3:'Extensión Gel', gal_lbl4:'Manicura Spa', gal_lbl5:'Pedicura',
    testi_tag:'Opiniones', testi_h2:'Lo que dicen <em>nuestras clientas</em>',
    testi1:'"Achi Atelier transformó completamente mi relación con el cuidado de uñas. La atención al detalle es notable — siempre salgo encantada. Una experiencia de lujo en París 11."',
    testi2:'"Reservar online es muy fácil, el salón es precioso y mis uñas duraron 4 semanas perfectamente. ¡Recomiendo Achi Atelier a todas mis amigas!"',
    testi3:'"El mejor nail studio de París, sin dudarlo. Las creaciones son impresionantes — transformaron mi idea en algo aún más bello."',
    cliente_depuis:'Clienta desde 2022', cliente_depuis2:'Clienta desde 2023', cliente_depuis3:'Clienta desde 2021',
    hours1_title:'Martes – Viernes', hours1_time:'10h00 – 20h00',
    hours2_title:'Sábado – Domingo', hours2_time:'10h00 – 20h00',
    hours3_title:'Lunes', hours3_time:'Cerrado',
    hours4_title:'Sin cita previa', hours4_time:'Según disponibilidad',
    contact_eyebrow:'Encuéntranos', contact_h2:'Ven a <em>visitarnos</em>',
    c_address_lbl:'Dirección', c_phone_lbl:'Teléfono', c_email_lbl:'Correo', contact_book_btn:'Reservar tratamiento',
    bk_tag:'Reservas', bk_h2:'Reserva tu <em>momento</em>',
    bkt_client:'Pedir cita', bkt_admin:'Panel Admin',
    step1:'Servicio', step2:'Fecha y hora', step3:'Tus datos', step4:'Confirmar',
    st1_intro:'Elige tu servicio para empezar:',
    btn_next:'Siguiente →', btn_back:'← Volver', btn_review:'Resumen →', btn_cancel:'Cancelar',
    lbl_fn:'Nombre *', lbl_ln:'Apellido *', lbl_em:'Email *', lbl_ph:'Teléfono (opcional)', lbl_msg:'Petición especial (opcional)',
    err_name:'Solo letras', err_email:'Email inválido', err_phone:'Solo números · 10–15 dígitos',
    admin_login_title:'Panel Administrador', admin_login_sub:'Introduce tu contraseña para acceder al panel.',
    admin_login_btn:'Entrar', admin_err:'Contraseña incorrecta', admin_logout:'Salir',
    admin_add:'+ Añadir', admin_upcoming:'Próximas',
    modal_title:'Añadir cita', modal_svc:'Servicio *', modal_date:'Fecha *', modal_time:'Hora *',
    modal_fn:'Nombre *', modal_ln:'Apellido *', modal_note:'Nota (opcional)', modal_save:'Guardar',
    f_nav:'Navegación', f_services:'Servicios', f_contact:'Contacto',
    footer_sub:'Tu santuario de belleza en el corazón del barrio 11 de París. Creamos más que uñas — creamos confianza.',
    footer_rights:'Todos los derechos reservados.', footer_made:'Hecho con 💗 en París',
    confirm_title:'Resumen de tu cita', confirm_sub:'Por favor revisa tus datos antes de confirmar.',
    tbl_svc:'Servicio', tbl_dur:'Duración', tbl_price:'Precio', tbl_date:'Fecha', tbl_time:'Hora', tbl_name:'Nombre', tbl_email:'Email', tbl_phone:'Teléfono', tbl_msg:'Petición',
    btn_edit:'← Editar', btn_confirm:'✓ Confirmar',
    success_title:'¡Cita confirmada!', success_sub:'¡Gracias {name}! Tu {svc} está reservado para el {date} a las {time}.<br>¡Te esperamos! 💅<br><span style="font-size:.78rem;opacity:.8">¿Necesitas cancelar? Contáctanos por WhatsApp o Instagram.</span>',
    btn_another:'Reservar otra cita',
    slots_lbl:'Horarios disponibles — {date}:',
    closed_today:'El salón está cerrado a esta hora. Próximo horario disponible mañana.',
    closed_tonight:'🌙 El salón está cerrado esta noche.',
    next_avail_prefix:'Próximo día disponible:',
    slots_word:'horarios',
    day_closed:'El salón cierra los lunes.',
    no_slots:'No hay horarios disponibles este día.',
    month_abbr:['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],
  },
  ru: {
    loader_sub:'Nail Studio · Париж 11',
    nav_about:'О нас', nav_services:'Услуги', nav_gallery:'Галерея', nav_contact:'Контакты', nav_book:'Записаться',
    hero_eyebrow:'Nail Studio · Париж, 11 округ',
    hero_h1:'Где каждая рука<br>рассказывает <em>красивую историю</em>',
    hero_sub:'Окунитесь в мир деликатного мастерства и полного расслабления. В Achi Atelier мы превращаем ваши ногти в маленькие шедевры — с заботой, страстью и парижской точностью.',
    hero_cta1:'Записаться сейчас', hero_cta2:'Наши услуги',
    stat1:'Довольных клиентов', stat2:'Лет опыта', stat3:'Уникальных работ',
    badge_rating:'Оценка клиентов', badge_tag:'Парижское мастерство',
    about_eyebrow:'Наша история',
    about_h2:'Создано с <em>Любовью</em>,<br>выполнено с Заботой',
    about_p1:'Achi Atelier — это не просто салон красоты, это ваш личный sanctuary. Расположенный в сердце 11-го округа Парижа, мы сочетаем мастерство и теплоту, чтобы создать опыт, столь же прекрасный, как результат.',
    about_p2:'Будь то минималистичный маникюр или сложный nail art — каждая услуга создаётся специально для вас, с лучшими продуктами и тщательным вниманием к каждой детали.',
    val1:'Премиум продукты', val2:'Безупречная гигиена', val3:'Индивидуальный подход', val4:'Парижское мастерство',
    about_lbl1:'Мастерство', about_lbl2:'Наш Ателье', about_lbl3:'Опыт', about_pill:'Лет',
    svc_tag:'Наши услуги', svc_h2:'Процедуры, созданные <em>для вас</em>',
    svc_sub:'Каждая услуга создана для того, чтобы раскрыть вашу природную красоту с продуктами, которые питают так же, как преображают.',
    tab_ongles:'💅 Ногти', tab_epil:'🌸 Эпиляция',
    cat_mani:'Маникюр', cat_pieds:'Педикюр', cat_complet:'Уход за руками и ногами',
    cat_pose:'Наращивание ногтей', cat_suppl:'Дополнительные услуги',
    cat_visage:'Лицо', cat_haut:'Верхняя часть тела', cat_bas:'Нижняя часть тела', cat_forfait:'Пакеты эпиляции',
    price_devis:'По запросу',
    suppl_note:'Дополнительные услуги добавляются к стоимости основной процедуры · Дизайн ногтей: цена согласовывается при записи',
    gal_tag:'Вдохновение', gal_h2:'Взгляните на <em>наши работы</em>',
    gal_sub:'Каждая процедура уникальна. Посмотрите некоторые из наших любимых работ.',
    gal_lbl1:'Signature Nail Art', gal_lbl2:'Классический маникюр', gal_lbl3:'Гель-наращивание', gal_lbl4:'Спа-маникюр', gal_lbl5:'Педикюр',
    testi_tag:'Отзывы клиентов', testi_h2:'Что говорят <em>наши клиентки</em>',
    testi1:'"Achi Atelier полностью изменил моё отношение к уходу за ногтями. Внимание к деталям поразительно — я всегда ухожу в восторге. Настоящий роскошный опыт в Париже."',
    testi2:'"Онлайн-запись очень проста, салон великолепен, и мои ногти держались 4 недели безупречно. Я рекомендую Achi Atelier всем своим подругам!"',
    testi3:'"Лучший nail studio в Париже, без сомнений. Дизайны ногтей потрясающие — они воплотили мою идею во что-то ещё более прекрасное."',
    cliente_depuis:'Клиент с 2022', cliente_depuis2:'Клиент с 2023', cliente_depuis3:'Клиент с 2021',
    hours1_title:'Вторник – Пятница', hours1_time:'10:00 – 20:00',
    hours2_title:'Суббота – Воскресенье', hours2_time:'10:00 – 20:00',
    hours3_title:'Понедельник', hours3_time:'Закрыто',
    hours4_title:'Без записи', hours4_time:'При наличии мест',
    contact_eyebrow:'Как нас найти', contact_h2:'Приходите <em>к нам</em>',
    c_address_lbl:'Адрес', c_phone_lbl:'Телефон', c_email_lbl:'Email', contact_book_btn:'Записаться на процедуру',
    bk_tag:'Запись', bk_h2:'Запишитесь на свой <em>сеанс</em>',
    bkt_client:'Записаться', bkt_admin:'Панель Админа',
    step1:'Услуга', step2:'Дата и время', step3:'Ваши данные', step4:'Подтверждение',
    st1_intro:'Выберите услугу для начала:',
    btn_next:'Далее →', btn_back:'← Назад', btn_review:'Итог →', btn_cancel:'Отмена',
    lbl_fn:'Имя *', lbl_ln:'Фамилия *', lbl_em:'Email *', lbl_ph:'Телефон (необязательно)', lbl_msg:'Особые пожелания (необязательно)',
    err_name:'Только буквы', err_email:'Неверный email', err_phone:'Только цифры · 10–15 цифр',
    admin_login_title:'Панель Администратора', admin_login_sub:'Введите пароль для доступа к панели управления.',
    admin_login_btn:'Войти', admin_err:'Неверный пароль', admin_logout:'Выйти',
    admin_add:'+ Добавить', admin_upcoming:'Предстоящие',
    modal_title:'Добавить запись', modal_svc:'Услуга *', modal_date:'Дата *', modal_time:'Время *',
    modal_fn:'Имя *', modal_ln:'Фамилия *', modal_note:'Заметка (необязательно)', modal_save:'Сохранить',
    f_nav:'Навигация', f_services:'Услуги', f_contact:'Контакты',
    footer_sub:'Ваш sanctuary красоты в сердце 11-го округа Парижа. Мы создаём больше, чем ногти — мы создаём уверенность.',
    footer_rights:'Все права защищены.', footer_made:'Сделано с 💗 в Париже',
    confirm_title:'Сводка записи', confirm_sub:'Пожалуйста, проверьте данные перед подтверждением.',
    tbl_svc:'Услуга', tbl_dur:'Длительность', tbl_price:'Цена', tbl_date:'Дата', tbl_time:'Время', tbl_name:'Имя', tbl_email:'Email', tbl_phone:'Телефон', tbl_msg:'Пожелание',
    btn_edit:'← Изменить', btn_confirm:'✓ Подтвердить',
    success_title:'Запись подтверждена!', success_sub:'Спасибо, {name}! Ваша процедура «{svc}» забронирована на {date} в {time}.<br>Ждём вас! 💅<br><span style="font-size:.78rem;opacity:.8">Нужно отменить? Напишите нам в WhatsApp или Instagram.</span>',
    btn_another:'Записаться ещё раз',
    slots_lbl:'Доступное время — {date}:',
    closed_today:'Салон закрыт в это время. Следующее доступное время — завтра.',
    closed_tonight:'🌙 Салон закрыт на сегодняшний вечер.',
    next_avail_prefix:'Следующий доступный день:',
    slots_word:'окна',
    day_closed:'Салон не работает по понедельникам.',
    no_slots:'На этот день нет доступных слотов.',
    month_abbr:['янв.','фев.','мар.','апр.','май','июн.','июл.','авг.','сен.','окт.','ноя.','дек.'],
  }
};
let LANG = 'fr';

function setLang(l) {
  LANG = l;
  document.documentElement.lang = l === 'ru' ? 'ru' : l === 'es' ? 'es' : l === 'en' ? 'en' : 'fr';
  document.querySelectorAll('.lb').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('lb-' + l);
  if (el) el.classList.add('active');
  const T = TRANS[l];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (T[k] !== undefined) el.innerHTML = T[k];
  });
}

/* ─── SERVICES DATA ─── */
const ALL_SVCS = [
  {cat:'Manucures', name:'Manucure classique', dur:20, price:'25€'},
  {cat:'Manucures', name:'Manucure spa', dur:30, price:'35€'},
  {cat:'Manucures', name:'Manucure japonaise', dur:30, price:'35€'},
  {cat:'Manucures', name:'Manucure avec vernis classique', dur:30, price:'30€'},
  {cat:'Manucures', name:'Manucure avec vernis semi-permanent', dur:40, price:'43€'},
  {cat:'Manucures', name:'Manucure spa avec vernis classique', dur:45, price:'40€'},
  {cat:'Manucures', name:'Manucure spa avec vernis semi-permanent', dur:50, price:'53€'},
  {cat:'Beauté des pieds', name:'Soin des pieds classique', dur:30, price:'38€'},
  {cat:'Beauté des pieds', name:'Soin des pieds spa', dur:45, price:'45€'},
  {cat:'Beauté des pieds', name:'Soin des pieds avec vernis classique', dur:40, price:'45€'},
  {cat:'Beauté des pieds', name:'Soin des pieds avec vernis semi-permanent', dur:50, price:'55€'},
  {cat:'Beauté des pieds', name:'Soin des pieds spa avec vernis classique', dur:50, price:'50€'},
  {cat:'Beauté des pieds', name:'Soin des pieds spa avec vernis semi-permanent', dur:55, price:'65€'},
  {cat:'Soins mains & pieds', name:'Soin complet mains et pieds sans vernis', dur:60, price:'55€'},
  {cat:'Soins mains & pieds', name:'Soin complet spa mains et pieds sans vernis', dur:60, price:'65€'},
  {cat:'Soins mains & pieds', name:'Soin complet mains et pieds avec vernis classique', dur:70, price:'60€'},
  {cat:'Soins mains & pieds', name:'Soin complet mains et pieds avec vernis semi-permanent', dur:80, price:'85€'},
  {cat:'Soins mains & pieds', name:'Soin complet spa mains et pieds avec vernis classique', dur:80, price:'75€'},
  {cat:'Soins mains & pieds', name:'Soin complet spa mains et pieds avec vernis semi-permanent', dur:90, price:'105€'},
  {cat:'Pose & Renforcement', name:'Gel X avec semi-permanent', dur:60, price:'60€'},
  {cat:'Pose & Renforcement', name:'Pose de résine avec semi-permanent', dur:60, price:'60€'},
  {cat:'Pose & Renforcement', name:'Pose de gel avec semi-permanent', dur:60, price:'70€'},
  {cat:'Pose & Renforcement', name:'Remplissage résine avec semi-permanent', dur:50, price:'55€'},
  {cat:'Pose & Renforcement', name:'Remplissage gel avec semi-permanent', dur:50, price:'65€'},
  {cat:'Épilation — Visage', name:'Sourcils', dur:15, price:'15€'},
  {cat:'Épilation — Visage', name:'Lèvre supérieure', dur:10, price:'10€'},
  {cat:'Épilation — Visage', name:'Menton', dur:10, price:'10€'},
  {cat:'Épilation — Visage', name:'Joues', dur:10, price:'10€'},
  {cat:'Épilation — Visage', name:'Visage complet (hors sourcils)', dur:20, price:'25€'},
  {cat:'Épilation — Corps', name:'Aisselles', dur:15, price:'15€'},
  {cat:'Épilation — Corps', name:'Demi-bras', dur:15, price:'15€'},
  {cat:'Épilation — Corps', name:'Bras complets', dur:20, price:'23€'},
  {cat:'Épilation — Corps', name:'Dos', dur:30, price:'30€'},
  {cat:'Épilation — Corps', name:'Torse', dur:30, price:'30€'},
  {cat:'Épilation — Corps', name:'Demi-jambes', dur:25, price:'20€'},
  {cat:'Épilation — Corps', name:'Jambes complètes', dur:40, price:'35€'},
  {cat:'Forfaits épilation', name:'Aisselles + demi-jambes', dur:35, price:'32€'},
  {cat:'Forfaits épilation', name:'Aisselles + jambes complètes', dur:50, price:'45€'},
  {cat:'Forfaits épilation', name:'Visage complet + sourcils', dur:25, price:'30€'},
  {cat:'Forfaits épilation', name:'Demi-jambes + aisselles + demi-bras', dur:45, price:'45€'},
  {cat:'Forfaits épilation', name:'Jambes complètes + aisselles + bras complets', dur:60, price:'60€'},
  {cat:'Forfaits épilation', name:'Aisselles + demi-bras', dur:30, price:'27€'},
  {cat:'Forfaits épilation', name:'Jambes complètes + aisselles', dur:55, price:'48€'},
  {cat:'Forfaits épilation', name:'Visage complet + aisselles', dur:35, price:'38€'},
];

/* ─── HELPERS ─── */
/* localDs: retourne YYYY-MM-DD en heure locale (évite le bug UTC Paris minuit-2h) */
function localDs(d) {
  const dd = d || new Date();
  return dd.getFullYear() + '-' + String(dd.getMonth() + 1).padStart(2,'0') + '-' + String(dd.getDate()).padStart(2,'0');
}
function tds() { return localDs(); }
function nowMins() { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); }
function tdp(n) { const d = new Date(); d.setDate(d.getDate() + n); return localDs(d); }
function toMins(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function fmtDate(ds) {
  if (!ds) return '';
  const [y, m, d] = ds.split('-');
  const T = TRANS[LANG] || TRANS.fr;
  const ms = T.month_abbr || ['jan.','fév.','mars','avr.','mai','juin','juil.','août','sep.','oct.','nov.','déc.'];
  return `${parseInt(d)} ${ms[parseInt(m)-1]} ${y}`;
}
function isTaken(ds, time, dur, excId = null) {
  const s = toMins(time), e = s + dur;
  return bookings.filter(b => b.date === ds && b.status !== 'cancelled' && b.id !== excId)
    .some(b => { const bs = toMins(b.time), be = bs + b.dur; return s < be && e > bs; });
}
function isPastSlot(ds, time) {
  const today = tds();
  if (ds > today) return false;
  if (ds < today) return true;
  return toMins(time) < nowMins();
}
function isMonday(ds) { return new Date(ds + 'T12:00:00').getDay() === 1; }

function getDynamicSlots(ds, dur) {
  /* Smart slot generation:
     Walk from 10:00 to 20:00-dur minute by minute in steps of min(dur,10),
     returning every slot that doesn't overlap a confirmed booking.
     This ensures gaps left by cancelled/shorter bookings are fillable.
  */
  const step = Math.min(dur, 10); // granularity: every 10 min or less
  const open = 10 * 60;
  const close = 20 * 60;
  const slots = [];
  for (let t = open; t + dur <= close; t += step) {
    const hh = Math.floor(t / 60).toString().padStart(2, '0');
    const mm = (t % 60).toString().padStart(2, '0');
    const time = hh + ':' + mm;
    if (!isTaken(ds, time, dur) && !isPastSlot(ds, time)) {
      slots.push(time);
    }
  }
  return slots;
}

/* ─── CURSOR ─── */
const cur = document.getElementById('cur'), ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function animRing() { rx += (mx - rx) * .13; ry += (my - ry) * .13; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animRing); })();

/* ─── LOADER ─── */
window.addEventListener('load', () => { setTimeout(() => document.getElementById('loader').classList.add('hide'), 2000); });

/* ─── NAVBAR ─── */
window.addEventListener('scroll', () => document.getElementById('navbar').classList.toggle('scrolled', scrollY > 60));
document.getElementById('ham').onclick = () => document.getElementById('mobile-menu').classList.add('open');
document.getElementById('mm-close').onclick = () => document.getElementById('mobile-menu').classList.remove('open');
function closeMM() { document.getElementById('mobile-menu').classList.remove('open'); }

/* ─── MARQUEE ─── */
const mqItems = ['Manucure Classique','Manucure Spa','Pose de Gel','Gel X','Semi-permanent','Soin des Pieds','Nail Art','Remplissage','Épilation Visage','Épilation Corps','Forfaits','Renforcement'];
const mt = document.getElementById('mqt');
let mqH = '';
for (let i = 0; i < 4; i++) mqItems.forEach(it => { mqH += `<span class="mq-item">${it}<span class="mq-dot"></span></span>`; });
mt.innerHTML = mqH;

/* ─── SCROLL ANIMATIONS ─── */
const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }), { threshold: .1 });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

/* ─── SERVICES TABS ─── */
function svcTab(t) {
  document.querySelectorAll('.svc-tab').forEach((b, i) => b.classList.toggle('active', (t === 'ongles' && i === 0) || (t === 'epil' && i === 1)));
  document.getElementById('sp-ongles').classList.toggle('active', t === 'ongles');
  document.getElementById('sp-epil').classList.toggle('active', t === 'epil');
}

/* ─── BOOKINGS DATA ─── */
function saveBookings() {} // overridden by Firebase module
let bookings = [];
let nextId = 1;
let fbReady = false; // true once Firebase has loaded at least once

/* Fallback : si Firebase ne répond pas dans 6s, on affiche quand même le tunnel */
setTimeout(() => {
  if (!fbReady) {
    fbReady = true;
    const loader = document.getElementById('fb-loading');
    if (loader) loader.style.display = 'none';
    const st1 = document.getElementById('st1');
    if (st1) st1.style.display = 'block';
  }
}, 6000);

/* ─── BOOKING CLIENT ─── */
let sel = { svc: null, date: null, time: null };
let weekOff = 0;

/* Build service cards — grouped by category */
(function () {
  const g = document.getElementById('csvc-grid');
  // Group services by category
  const groups = {};
  ALL_SVCS.forEach(s => { if (!groups[s.cat]) groups[s.cat] = []; groups[s.cat].push(s); });
  Object.entries(groups).forEach(([cat, svcs]) => {
    const section = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'csvc-group-title';
    title.textContent = cat;
    section.appendChild(title);
    const cards = document.createElement('div');
    cards.className = 'csvc-cards';
    svcs.forEach(s => {
      const d = document.createElement('div');
      d.className = 'csvc';
      d.innerHTML = `<span class="csvc-check">✓</span><div class="csvc-name">${s.name}</div><div class="csvc-dur">${s.dur} min</div><div class="csvc-price">${s.price}</div>`;
      d.onclick = () => {
        document.querySelectorAll('.csvc').forEach(c => c.classList.remove('sel'));
        d.classList.add('sel');
        sel.svc = s; sel.date = null; sel.time = null; weekOff = 0;
        document.getElementById('bs1').disabled = false;
      };
      cards.appendChild(d);
    });
    section.appendChild(cards);
    g.appendChild(section);
  });
  /* modal select */
  const ms = document.getElementById('m-svc');
  ALL_SVCS.forEach(s => {
    const o = document.createElement('option');
    o.value = `${s.name}|${s.dur}|${s.price}`;
    o.textContent = `${s.name} (${s.dur} min)`;
    ms.appendChild(o);
  });
})();

function goStep(n) {
  [1, 2, 3, 4].forEach(i => {
    document.getElementById('st' + i).style.display = i === n ? 'block' : 'none';
    const s = document.getElementById('si' + i);
    s.classList.remove('active', 'done');
    if (i < n) s.classList.add('done');
    if (i === n) s.classList.add('active');
    if (i < 4) document.getElementById('sl' + i).classList.toggle('done', i < n);
  });
  if (n === 2) { document.getElementById('ss1').textContent = sel.svc ? `${sel.svc.name} · ${sel.svc.dur} min` : '—'; renderWeek(); }
  if (n === 3) {
    document.getElementById('s3s').textContent = sel.svc?.name || '—';
    document.getElementById('s3d').textContent = sel.date ? fmtDate(sel.date) : '—';
    document.getElementById('s3t').textContent = sel.time || '—';
  }
  if (n === 4) renderConfirm();
}

function getWeekDates() {
  // Jump to open week if current date is before opening
  const openDate = new Date('2026-06-08T00:00:00'); openDate.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  if (today < openDate && weekOff === 0) {
    const diffDays = Math.ceil((openDate - today) / (1000*60*60*24));
    weekOff = Math.floor(diffDays / 7);
  }
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const mon = new Date(t); const dow = t.getDay();
  mon.setDate(t.getDate() - (dow === 0 ? 6 : dow - 1) + weekOff * 7);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return d; });
}
function prevWeek() { if (weekOff > 0) { weekOff--; renderWeek(); } }
function nextWeek() { weekOff++; renderWeek(); }

function renderWeek() {
  const days = getWeekDates();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const labels = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
  const f = days[0], l = days[6];
  document.getElementById('wk-lbl').textContent = `${f.getDate()} ${months[f.getMonth()]} — ${l.getDate()} ${months[l.getMonth()]} ${l.getFullYear()}`;
  document.getElementById('btn-pw').disabled = weekOff <= 0;
  const g = document.getElementById('week-row'); g.innerHTML = '';
  const T = TRANS[LANG] || TRANS.fr;
  const slotWord = T.slots_word || 'créneaux';
  days.forEach((d, i) => {
    const ds = localDs(d);
    const openDate = new Date('2026-06-08T00:00:00'); openDate.setHours(0,0,0,0);
    const past = d < today || d < openDate;
    const mon = isMonday(ds);
    const isToday = ds === tds();
    const slots = getDynamicSlots(ds, sel.svc ? sel.svc.dur : 30);
    let free = 0;
    if (!past && !mon && sel.svc) {
      free = slots.length;
    } else if (!past && !mon) {
      free = slots.length;
    }
    const col = document.createElement('div'); col.className = 'wday-col';
    const lbl = document.createElement('div'); lbl.className = 'wday-lbl'; lbl.textContent = labels[i];
    const btn = document.createElement('button');
    btn.className = 'wday-btn' + (isToday ? ' today-btn' : '') + (ds === sel.date ? ' sel' : '');
    btn.innerHTML = `<div class="dn">${d.getDate()}</div><div class="df">${(!past && !mon && free > 0) ? free + ' ' + slotWord : ''}</div>`;
    if (past || mon || free === 0) { btn.disabled = true; }
    else {
      btn.onclick = () => {
        sel.date = ds; sel.time = null;
        document.querySelectorAll('.wday-btn').forEach(b => b.classList.remove('sel'));
        btn.classList.add('sel');
        document.getElementById('bs2').disabled = true;
        renderSlots(ds);
      };
    }
    col.appendChild(lbl); col.appendChild(btn); g.appendChild(col);
  });
  if (sel.date) renderSlots(sel.date);
  else document.getElementById('slots-sec').style.display = 'none';
  // Show pre-opening notice if first day of displayed week is before openDate
  const preNotice = document.getElementById('pre-opening-notice');
  if (preNotice) {
    const openD = new Date('2026-06-08T00:00:00'); openD.setHours(0,0,0,0);
    const firstDay = days[0];
    preNotice.style.display = (firstDay < openD) ? 'block' : 'none';
  }

  /* Message "salon fermé ce soir" si après 20h */
  const closedMsg = document.getElementById('closed-today-msg');
  if (nowMins() >= 20 * 60 && weekOff === 0) {
    /* Trouver le prochain jour disponible (ni lundi, ni passé) */
    let nextAvail = null;
    for (let n = 1; n <= 7; n++) {
      const nd = tdp(n);
      if (!isMonday(nd)) { nextAvail = nd; break; }
    }
    const T2 = TRANS[LANG] || TRANS.fr;
    const msg = (T2.closed_tonight || 'Le salon est fermé pour ce soir.') +
      (nextAvail ? ' ' + (T2.next_avail_prefix || 'Prochain créneau :') + ' ' + fmtDate(nextAvail) + '.' : '');
    closedMsg.textContent = msg;
    closedMsg.style.display = 'block';
  } else {
    closedMsg.style.display = 'none';
  }
}

function renderSlots(ds) {
  const sec = document.getElementById('slots-sec'); sec.style.display = 'block';
  const T = TRANS[LANG];
  document.getElementById('slots-lbl').textContent = (T.slots_lbl || 'Créneaux disponibles — {date}:').replace('{date}', fmtDate(ds));
  const g = document.getElementById('slots-row'); g.innerHTML = '';
  const dur = sel.svc ? sel.svc.dur : 30;
  const available = getDynamicSlots(ds, dur);
  if (available.length === 0) {
    const msg = document.createElement('p');
    msg.style.cssText = 'font-size:.82rem;color:var(--muted);grid-column:1/-1;padding:.5rem 0';
    msg.textContent = (T.no_slots || 'Aucun créneau disponible ce jour.');
    g.appendChild(msg);
    return;
  }
  available.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'slot' + (sel.time === t ? ' sel' : '');
    btn.textContent = t;
    btn.onclick = () => {
      sel.time = t;
      document.querySelectorAll('.slot').forEach(s => s.classList.remove('sel'));
      btn.classList.add('sel');
      document.getElementById('bs2').disabled = false;
    };
    g.appendChild(btn);
  });
}

/* ─── VALIDATION ─── */
function vN(el, hid) { const v = el.value.trim(), ok = /^[a-zA-ZÀ-ÿ\u0400-\u04FF\s'\-]+$/.test(v) || v === ''; el.classList.toggle('err', !ok && v !== ''); el.classList.toggle('ok', ok && v !== ''); document.getElementById(hid).classList.toggle('show', !ok && v !== ''); }
function vE(el) { const v = el.value.trim(), ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || v === ''; el.classList.toggle('err', !ok && v !== ''); el.classList.toggle('ok', ok && v !== ''); document.getElementById('h-em').classList.toggle('show', !ok && v !== ''); }
function vP(el) { el.value = el.value.replace(/[^0-9+\s\-()]/g, ''); const d = el.value.replace(/\D/g, ''), v = el.value.trim(), ok = (d.length >= 10 && d.length <= 15) || v === ''; el.classList.toggle('err', !ok && v !== ''); el.classList.toggle('ok', ok && v !== ''); document.getElementById('h-ph').classList.toggle('show', !ok && v !== ''); }

function tryStep4() {
  const fn = document.getElementById('f-fn').value.trim();
  const ln = document.getElementById('f-ln').value.trim();
  const em = document.getElementById('f-em').value.trim();
  const ph = document.getElementById('f-ph').value.trim();
  let ok = true;
  if (!fn || !/^[a-zA-ZÀ-ÿ\u0400-\u04FF\s'\-]+$/.test(fn)) { document.getElementById('f-fn').classList.add('err'); document.getElementById('h-fn').classList.add('show'); ok = false; }
  if (!ln || !/^[a-zA-ZÀ-ÿ\u0400-\u04FF\s'\-]+$/.test(ln)) { document.getElementById('f-ln').classList.add('err'); document.getElementById('h-ln').classList.add('show'); ok = false; }
  if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { document.getElementById('f-em').classList.add('err'); document.getElementById('h-em').classList.add('show'); ok = false; }
  if (ph) { const d = ph.replace(/\D/g, ''); if (d.length < 10 || d.length > 15) { document.getElementById('f-ph').classList.add('err'); document.getElementById('h-ph').classList.add('show'); ok = false; } }
  if (ok) goStep(4);
}

function renderConfirm() {
  const T = TRANS[LANG];
  const fn = document.getElementById('f-fn').value.trim();
  const ln = document.getElementById('f-ln').value.trim();
  const em = document.getElementById('f-em').value.trim();
  const ph = document.getElementById('f-ph').value.trim();
  const msg = document.getElementById('f-msg').value.trim();
  document.getElementById('s4i').innerHTML = `
    <p style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;margin-bottom:.8rem">${T.confirm_title || 'Récapitulatif'}</p>
    <p style="font-size:.82rem;color:var(--muted);margin-bottom:.9rem">${T.confirm_sub || 'Vérifiez vos informations avant de confirmer.'}</p>
    <table class="confirm-tbl">
      <tr><td>${T.tbl_svc || 'Prestation'}</td><td><strong>${sel.svc.name}</strong></td></tr>
      <tr><td>${T.tbl_dur || 'Durée'}</td><td>${sel.svc.dur} min</td></tr>
      <tr><td>${T.tbl_price || 'Prix'}</td><td><strong style="color:var(--brown)">${sel.svc.price}</strong></td></tr>
      <tr><td>${T.tbl_date || 'Date'}</td><td>${fmtDate(sel.date)}</td></tr>
      <tr><td>${T.tbl_time || 'Heure'}</td><td>${sel.time}</td></tr>
      <tr><td>${T.tbl_name || 'Nom'}</td><td>${fn} ${ln}</td></tr>
      <tr><td>${T.tbl_email || 'Email'}</td><td>${em}</td></tr>
      ${ph ? `<tr><td>${T.tbl_phone || 'Téléphone'}</td><td>${ph}</td></tr>` : ''}
      ${msg ? `<tr><td>${T.tbl_msg || 'Demande'}</td><td><em>${msg}</em></td></tr>` : ''}
    </table>
    <div class="btn-row">
      <button class="btn-b" onclick="goStep(3)">${T.btn_edit || '← Modifier'}</button>
      <button class="btn-p" id="btn-confirm-bk"> ${T.btn_confirm || '✓ Confirmer'}</button>
    </div>`;
  /* Wirer le bouton de confirmation sans injection inline */
  document.getElementById('btn-confirm-bk').addEventListener('click', () => submitBooking(fn, ln, em, ph, msg));
}

function submitBooking(fn, ln, em, ph, msg) {
  if (!fbReady) { alert('Chargement en cours, veuillez patienter quelques secondes.'); return; }
  if (window._fbSubmit) { window._fbSubmit(fn, ln, em, ph, msg); }
  else { alert('Connexion en cours, veuillez réessayer dans quelques secondes.'); }
}

function resetClient() {
  document.querySelectorAll('.csvc').forEach(c => c.classList.remove('sel'));
  ['f-fn', 'f-ln', 'f-em', 'f-ph', 'f-msg'].forEach(id => { const el = document.getElementById(id); if (el) { el.value = ''; el.classList.remove('err', 'ok'); } });
  weekOff = 0; sel = { svc: null, date: null, time: null };
  document.getElementById('s4i').innerHTML = '';
  document.getElementById('bs1').disabled = true;
  goStep(1);
}

/* ─── BOOKING TAB ─── */
function bkTab(t) {
  ['client', 'admin'].forEach(x => {
    document.getElementById('bkt-' + x).classList.toggle('active', x === t);
    document.getElementById('bp-' + x).classList.toggle('active', x === t);
  });
  if (t === 'admin' && !adminLoggedIn) {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-dash').classList.remove('visible');
  }
  if (t === 'admin' && adminLoggedIn) renderAdmin();
}

/* ─── ADMIN AUTH ─── */
let adminLoggedIn = false;
const ADMIN_PW_HASH = '2b7cccaf9ae588b9b85399d000fc5b47b766dd723b028ac26c68d020da21889b';
async function adminLogin() {
  const pw = document.getElementById('admin-pw-input').value;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  if (hex === ADMIN_PW_HASH) {
    adminLoggedIn = true;
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dash').classList.add('visible');
    renderAdmin();
  } else {
    document.getElementById('admin-err').classList.add('show');
    document.getElementById('admin-pw-input').value = '';
    setTimeout(() => document.getElementById('admin-err').classList.remove('show'), 3000);
  }
}
function adminLogout() {
  adminLoggedIn = false;
  document.getElementById('admin-login').style.display = 'block';
  document.getElementById('admin-dash').classList.remove('visible');
  document.getElementById('admin-pw-input').value = '';
}

/* ─── ADMIN ─── */
let aMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selDay = null;
function aPrev() { aMonth.setMonth(aMonth.getMonth() - 1); renderAdminCal(); }
function aNext() { aMonth.setMonth(aMonth.getMonth() + 1); renderAdminCal(); }

function renderAdmin() { renderMetrics(); renderAdminCal(); renderUpcoming(); }

function renderMetrics() {
  const today = tds();
  const tot = bookings.filter(b => b.status !== 'cancelled').length;
  const up = bookings.filter(b => b.date >= today && b.status !== 'cancelled').length;
  const tc = bookings.filter(b => b.date === today && b.status !== 'cancelled').length;
  const ca = bookings.filter(b => b.status === 'cancelled').length;
  document.getElementById('am-metrics').innerHTML = `
    <div class="met"><div class="met-lbl">Actives</div><div class="met-val" style="color:var(--brown)">${tot}</div></div>
    <div class="met"><div class="met-lbl">À venir</div><div class="met-val" style="color:#4D7A96">${up}</div></div>
    <div class="met"><div class="met-lbl">Aujourd'hui</div><div class="met-val" style="color:#5C8A3E">${tc}</div></div>
    <div class="met"><div class="met-lbl">Annulées</div><div class="met-val" style="color:var(--muted)">${ca}</div></div>`;
}

function renderAdminCal() {
  const mNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  document.getElementById('a-month-lbl').textContent = `${mNames[aMonth.getMonth()]} ${aMonth.getFullYear()}`;
  const hdr = document.getElementById('mgh'); hdr.innerHTML = '';
  ['L','M','M','J','V','S','D'].forEach(l => { const d = document.createElement('div'); d.className = 'mghd'; d.textContent = l; hdr.appendChild(d); });
  const g = document.getElementById('mg'); g.innerHTML = '';
  const first = new Date(aMonth.getFullYear(), aMonth.getMonth(), 1);
  const last = new Date(aMonth.getFullYear(), aMonth.getMonth() + 1, 0);
  const sDow = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const total = Math.ceil((sDow + last.getDate()) / 7) * 7;
  const today = tds();
  for (let i = 0; i < total; i++) {
    const d = new Date(aMonth.getFullYear(), aMonth.getMonth(), i - sDow + 1);
    const ds = localDs(d);
    const iM = d.getMonth() === aMonth.getMonth();
    const db = bookings.filter(b => b.date === ds).sort((a, b) => a.time.localeCompare(b.time));
    const cell = document.createElement('div');
    cell.className = 'mc' + (iM ? '' : ' oth') + (ds === today ? ' tod' : '') + (ds === selDay ? ' seld' : '');
    cell.onclick = () => { selDay = ds; renderAdminCal(); renderDayPanel(ds); };
    let html = `<div class="mc-num">${d.getDate()}</div>`;
    db.filter(b => b.status !== 'cancelled').slice(0, 2).forEach(b => { html += `<div class="apdot apdot-c">${b.time} ${b.first}</div>`; });
    const xc = db.filter(b => b.status === 'cancelled').length;
    if (xc > 0) html += `<div class="apdot apdot-x">✕${xc}</div>`;
    if (db.filter(b => b.status !== 'cancelled').length > 2) html += `<div style="font-size:.6rem;color:var(--muted)">+${db.filter(b => b.status !== 'cancelled').length - 2}</div>`;
    cell.innerHTML = html; g.appendChild(cell);
  }
  if (selDay) renderDayPanel(selDay);
}

function renderDayPanel(ds) {
  const db = bookings.filter(b => b.date === ds).sort((a, b) => a.time.localeCompare(b.time));
  const el = document.getElementById('dp');
  el.innerHTML = `<div class="dp-wrap">
    <div class="dp-hdr">
      <span class="dp-date">📅 ${fmtDate(ds)}</span>
      <button class="btn-p" onclick="openModal('${ds}')" style="font-size:.7rem;padding:.42rem 1rem">+ Ajouter</button>
    </div>
    <div>${db.length
      ? db.map(b => `<div class="appt-item">
          <div>
            <div class="appt-time">${b.time}</div>
            <span class="abadge ${b.status === 'cancelled' ? 'abadge-x' : 'abadge-c'}">${b.status === 'cancelled' ? 'annulé' : 'confirmé'}</span>
          </div>
          <div>
            <div class="appt-name">${b.first} ${b.last}</div>
            <div class="appt-detail">${b.service} · ${b.dur}min · ${b.price}</div>
            <div class="appt-detail">✉ ${b.email}${b.phone ? ' · 📞 ' + b.phone : ''}</div>
            ${b.msg ? `<div class="appt-note">"${b.msg}"</div>` : ''}
            ${b.status !== 'cancelled' ? `<button class="btn-xcl" onclick="cancelB(${b.id})">✕ Annuler</button>` : ''}
          </div>
          <div style="font-size:.76rem;color:var(--muted);text-align:right;font-weight:600">${b.dur}min</div>
        </div>`).join('')
      : '<div class="na">😌 Aucun rendez-vous — journée libre !</div>'}
    </div>
  </div>`;
}

function cancelB(id) { if (window._fbCancel) window._fbCancel(id); }

function renderUpcoming() {
  const today = tds();
  const up = bookings.filter(b => b.date >= today && b.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).slice(0, 8);
  document.getElementById('up-count').textContent = up.length;
  const el = document.getElementById('up-list');
  el.innerHTML = up.length
    ? up.map(b => `<div class="up-item" onclick="selDay='${b.date}';renderAdminCal()">
        <div class="up-date">${fmtDate(b.date)} · ${b.time}</div>
        <div class="up-name">${b.first} ${b.last}</div>
        <div class="up-svc">${b.service} · ${b.price}</div>
      </div>`).join('')
    : '<div class="na">Aucun rendez-vous à venir</div>';
}

/* ─── ADMIN MODAL ─── */
function openModal(pd) {
  document.getElementById('m-dt').value = pd || tds();
  document.getElementById('m-tm').value = '10:00';
  ['m-fn', 'm-ln', 'm-em', 'm-ph', 'm-note'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('modal-overlay').style.display = 'flex';
}
function closeModal() { document.getElementById('modal-overlay').style.display = 'none'; }
function saveModal() { if (window._fbSaveModal) window._fbSaveModal(); }
document.getElementById('modal-overlay').onclick = function (e) { if (e.target === this) closeModal(); };
