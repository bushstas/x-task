<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
}

$lang = $_REQUEST['lang'];

switch ($lang) {
	case 'eng':
		$data = array(
			'by_type' => 'Type',
			'by_status' => 'Status',
			'by_importance' => 'Importance',
			'by_author' => 'Author',
			'by_exec' => 'Executor',
			'board' => 'Board',
			'all_projects' => 'All projects',
			'by_spec' => 'Post',
			'by_mine' => 'Mine',

			'admins' => 'Admins',
			'execs' => 'Executors',
			'free' => 'Without work',
			'busy' => 'In work',

			'current_task' => 'Current task',
			'description' => 'Description',
			'notifications' => 'Notifications',
			'logo' => 'XTask',
			'home' => 'My info',
			'not_available' => 'not specified',
			'my_account' => 'My account',
			'users' => 'Users',
			'projects' => 'Projects',
			'tasks' => 'Tasks',
			'team' => 'Team',
			'invitations' => 'Invitations',
			'roles' => 'Roles',
			'auth' => 'Authorization',
			'login' => 'Login',
			'password' => 'Password',
			'password2' => 'Repeat password',
			'nothave' => 'none',
			'none' => 'No tasks in work',
			'title' => 'Title',
			'name' => 'Name',
			'role' => 'Role',
			'spec' => 'Specialization',
			'email' => 'E-mail',
			'create_user' => 'Create user',
			'user_editing' => 'Edit user',
			'user_adding' => 'New user',
			'add' => 'Add',
			'add_task' => 'Add task',
			'save_task' => 'Save task',
			
			'mark' => 'Task marker',
			'selection' => 'Selection',
			'descr' => 'Text',
			'ui' => 'UI element',
			'area' => 'Special area',
			'pageproto' => 'Page prototype',
			'drawing' => 'Drawing canvas',
			'record' => 'Actions recording',
			//'del' => 'Add removal area',
			
			'save' => 'Save',
			'cancel' => 'Cancel',
			'yes' => 'Yes',
			'no' => 'No',
			'logout' => 'Log out',
			'enter' => 'Log in',
			'registration' => 'Registration',
			'register' => 'Register',
			'no_tasks' => 'No tasks found',
			'no_users' => 'No users found',
			'open_tasks' => 'Actual tasks',
			'participants' => 'Participants',
			'info' => 'My data',
			'my_tasks' => 'My tasks',
			'task_inf' => 'Task information',
			'tasks_from_me' => 'From me',
			'tasks_for_me' => 'Available',
			'all_tasks' => 'All tasks',
			'all' => 'All',
			'mine_tasks' => 'Mine',
			
			'status_frozen' => 'Back burner',
			'status_closed' => 'Archive',
			'status_ready' => 'Ready',
			'status_in_work' => 'In work',
			'status_current' => 'To do',
			'status_cant_do' => 'Problematic',
			'status_delayed' => 'Deferred',

			'settings' => 'Settings',
			'create_project' => 'Create project',
			'create_task' => 'Create task',
			'work_status' => 'Set status',
			'quickcall' => 'Quick task search',
			'activate_project' => 'Switch to this project',
			'current_project' => 'This is the current project',
			'request_access' => 'Request an access from administrator',
			'access_requested' => 'Access is already requested',
			'invitation' => 'Invitation',
			'pick_role' => 'Select a role',
			'pick_spec' => 'Select a specialization',

			'head' => 'Head',
			'admin' => 'Administrator',
			'editor' => 'Editor',
			'analyst' => 'Analyst',
			'tester' => 'Tester',
			'developer' => 'Developer',
			'observer' => 'Observer',

			'fullstack' => 'Full-stack',
			'htmler' => 'HTML coder',
			'designer' => 'Designer',
			'sysadmin' => 'SysAdmin',

			'design' => 'Design',
			'html' => 'HTML',
			'text' => 'Texts',
			'txt' => 'Text',
			'prototype' => 'Prototypes',
			'sysadm' => 'System administration',
			'backend' => 'Backend',
			'frontend' => 'Frontend',
			'test' => 'Tests',
			'page' => 'Page',
			'style' => 'Styles',
			'project' => 'Project',

			'developing' => 'Development',
			'editing' => 'Correction',
			'remaking' => 'Recast',
			'removing' => 'Removing',
			'repairing' => 'Repair',
			'debugging' => 'Debugging',
			'planning' => 'Planning',

			'burinig' => 'Burinig',
			'urgent' => 'Urgent',
			'important' => 'Important',
			'usual' => 'Usual',
			'insignificant' => 'Insignificant',

			'closed' => 'Closed',
			'deleted' => 'Deleted',
			'ready' => 'Ready',
			'to_approve' => 'For approval',
			'to_test' => 'For testing',
			'to_check' => 'For checking',
			'delayed' => 'Delayed',
			'in_work' => 'In work',
			'cant_do' => 'Can\'t do',

			'assign_executors' => 'Assign executors',
			'task_info' => 'Fill extended task info',
			'terms' => 'Task terms and difficulty',

			'importance' => 'Importance',
			'category' => 'Category',
			'action' => 'Action',

			'insertion' => 'Insertion',

			'bind' => 'Bind marker with selection',
			'remove' => 'Remove',
			'lock' => 'Lock',
			'fix' => 'Fixate',
			'insert' => 'Insert into element',
			'here' => 'Move to click place',
			'center' => 'Move to center',
			'find' => 'Find',

			'only_one' => 'There can be only',
			'one1' => 'one',
			'one2' => 'one',

			'cancel_task' => 'Stop creating task',

			'blocked' => 'Blocked',

			'mask' => 'Mask mode. Active when you browse or create tasks. Mouse wheel for opacity setting',
			'layer' => 'Hide/show inactive elements',
			'cut' => 'Cut out an area from the mask',
			'move' => 'Dragging and changing size of canvas mode',
			'draw' => 'Drawing mode. Adjust brush size by mouse wheel',
			'write' => 'Typing mode. Adjust font size by mouse wheel',
			'opacity' => 'Opacity changing mode. Adjust opacity by mouse wheel',
			'eraser' => 'Clear the canvas',
			'undo' => 'Undo last action',
			'left' => 'Previous element',
			'right' => 'Next element',

			'button' => 'Button',
			'link' => 'Link',
			'image' => 'Image',
			'list' => 'List',
			'table' => 'Table',
			'form' => 'Form',

			'tooltip' => 'Tooltip',
			'locked' => 'Temporarily locked for work',
			'release' => 'Release',
			'planned' => 'Scheduled for',
			'tasks_complete' => 'Tasks progress',
			'information' => 'Information',
			'comments' => 'Comments',
			'problems' => 'Problems',
			'difficulties' => array(
				'very easy',
				'pretty easy',
				'easy',
				'simple',
				'average',
				'uneasy',
				'complicated',
				'difficult',
				'hard',
				'very hard'
			),
			'editmode' => 'Edit task mode',
			'createmode' => 'Create task mode',
			'edit_status' => 'Change status',
			'quick_call' => 'Type a task number end press Enter'
		);
	break;

	default:	
		$data = array(
			'by_type' => 'Тип',
			'by_status' => 'Статус',
			'by_importance' => 'Важность',
			'by_author' => 'Автор',
			'by_exec' => 'Исполнитель',
			'board' => 'Доска',
			'by_spec' => 'Должность',
			'by_mine' => 'Мои',
			'all_projects' => 'Все проекты',

			'admins' => 'Админы',
			'execs' => 'Исполнители',
			'free' => 'Без работы',
			'busy' => 'В работе',
			
			'current_task' => 'Текущая задача',
			'description' => 'Описание',
			'notifications' => 'Уведомления',
			'logo' => 'XTask',
			'home' => 'Мое инфо',
			'not_available' => 'не указана',
			'my_account' => 'Мой аккаунт',
			'users' => 'Пользователи',
			'projects' => 'Проекты',
			'tasks' => 'Задачи',
			'team' => 'Команда',
			'invitations' => 'Пришлашения',
			'roles' => 'Роли',
			'auth' => 'Авторизация',
			'login' => 'Логин',
			'password' => 'Пароль',
			'password2' => 'Повторите пароль',
			'nothave' => 'отсутствуют',
			'none' => 'Нет задачи в работе',
			'title' => 'Название',
			'taskurl' => 'Адрес страниц(ы), где задача будет доступна',
			'name' => 'Имя',
			'role' => 'Роль',
			'spec' => 'Специализация',
			'email' => 'Эл. почта',
			'create_user' => 'Создать пользователя',
			'user_editing' => 'Редактирование пользователя',
			'user_adding' => 'Создание пользователя',
			'add' => 'Добавить',
			'add_task' => 'Добавить задачу',
			'save_task' => 'Сохранить задачу',
			'insertion' => 'Вставка',			

			'mark' => 'Маркер задачи',
			'selection' => 'Область выделения',
			'descr' => 'Текст',
			'ui' => 'UI элемент',
			'area' => 'Спец. область',
			'pageproto' => 'Макет страницы',
			'drawing' => 'Холст для рисования',
			'record' => 'Запись действий',
			// 'del' => 'Добавить область удаления',

			'save' => 'Сохранить',
			'cancel' => 'Отмена',
			'yes' => 'Да',
			'no' => 'Нет',
			'logout' => 'Выйти',
			'enter' => 'Войти',
			'registration' => 'Регистрация',
			'register' => 'Зарегистрироваться',
			'no_tasks' => 'Задачи не найдены',
			'no_users' => 'Пользователи не найдены',
			'open_tasks' => 'Откр. задачи',
			'participants' => 'Участники',
			'info' => 'Мои данные',
			'my_tasks' => 'Мои задачи',
			'task_inf' => 'Информация о задаче',
			'tasks_from_me' => 'От меня',
			'tasks_for_me' => 'Доступные',
			'all_tasks' => 'Все задачи',
			'mine_tasks' => 'Мои',

			'all' => 'Все',
			'status_frozen' => 'Долгий ящик',
			'status_closed' => 'Архив',
			'status_ready' => 'Готовые',
			'status_in_work' => 'В работе',
			'status_current' => 'Текущие',
			'status_cant_do' => 'Проблемные',
			'status_delayed' => 'Отложенные',
			
			'settings' => 'Настройки',
			'create_project' => 'Создать проект',
			'create_task' => 'Создать задачу',
			'work_status' => 'Настроить статус',
			'quickcall' => 'Быстрый поиск задачи',
			'activate_project' => 'Переключиться на этот проект',
			'current_project' => 'Это ваш текущий проект',
			'request_access' => 'Запросить доступ у администраторов',
			'access_requested' => 'Доступ уже запрошен',
			'invitation' => 'Приглашение',
			'pick_role' => 'Выберите роль',
			'pick_spec' => 'Выберите спиециализацию',

			'head' => 'Руководитель',
			'admin' => 'Администратор',
			'editor' => 'Редактор',
			'analyst' => 'Аналитик',
			'tester' => 'Тестировщик',
			'developer' => 'Разработчик',
			'observer' => 'Наблюдатель',

			'fullstack' => 'Full-stack',
			'htmler' => 'Верстальщик',
			'designer' => 'Дизайнер',
			'sysadmin' => 'Сисадмин',

			'design' => 'Дизайн',
			'html' => 'Верстка',
			'text' => 'Тексты',
			'txt' => 'Текст',
			'prototype' => 'Макеты',
			'sysadm' => 'Системное администрирование',
			'backend' => 'Бэкэнд',
			'frontend' => 'Фронтэнд',
			'test' => 'Тесты',
			'page' => 'Страница',
			'style' => 'Стили',
			'project' => 'Проект',

			'developing' => 'Разработка',
			'editing' => 'Правка',
			'remaking' => 'Переработка',
			'removing' => 'Удаление',
			'repairing' => 'Починка',
			'debugging' => 'Отладка',
			'planning' => 'Планирование',

			'burning' => 'Горящая',
			'urgent' => 'Срочная',
			'important' => 'Важная',
			'usual' => 'Обычная',
			'insignificant' => 'Незначительная',

			'closed' => 'Закрыта',
			'deleted' => 'Удалена',
			'ready' => 'Готова',
			'to_approve' => 'На одобрение',
			'to_test' => 'На тестирование',
			'to_check' => 'На проверку',
			'delayed' => 'Отложена',
			'in_work' => 'В работе',
			'cant_do' => 'Не могу сделать',

			'assign_executors' => 'Назначить исполнителей',
			'task_info' => 'Заполнить расширенную информацию',
			'terms' => 'Сложность и сроки задачи',
			'assign_task' => 'Назначение задачи',
						
			'importance' => 'Важность',
			'category' => 'Категория',
			'action' => 'Действие',

			'bind' => 'Связать маркер с областью выделения',
			'remove' => 'Удалить',
			'lock' => 'Заблокировать для редактирования',
			'fix' => 'Зафиксировать на месте',
			'insert' => 'Вставить в элемент',
			'here' => 'Переместить в место клика',
			'center' => 'Переместить в центр',
			'find' => 'Найти',
			'only_one' => 'Может быть только',
			'one1' => 'один',
			'one2' => 'одна',

			'cancel_task' => 'Прекратить создание задачи',
			'blocked' => 'Заблокирован',

			'layer' => 'Спрятать/Показать неактивные элементы',
			'mask' => 'Режим маски. Активируется при просмотре или создании задач. Колесико мыши для настройки прозрачности',
			'cut' => 'Вырезать область в маске',

			'move' => 'Режим перетаскивания и изменения размеров холста',
			'draw' => 'Режим рисования. Регулируйте размер кисти колесиком мыши',
			'write' => 'Режим набора текста. Регулируйте размер шрифта колесиком мыши',
			'opacity' => 'Режим изменения прозрачности (колесиком мыши)',
			'eraser' => 'Очистить холст',
			'undo' => 'Отменить последнее действие',
			'left' => 'Предыдущий элемент',
			'right' => 'Следующий элемент',

			'button' => 'Кнопка',
			'link' => 'Ссылка',
			'image' => 'Изображение',
			'list' => 'Список',
			'table' => 'Таблица',
			'form' => 'Форма',

			'tooltip' => 'Подсказка',
			'locked' => 'Временно закрыта для работы',
			'information' => 'Информация',
			'comments' => 'Комментарии',
			'problems' => 'Проблемы',
			'release' => 'Релиз',
			'planned' => 'Намечен на',
			'tasks_complete' => 'Завершено задач',
			'difficulties' => array(
				'очень легкая',
				'довольно легкая',
				'легкая',
				'простая',
				'средняя',
				'непростая',
				'сложноватая',
				'сложная',
				'тяжелая',
				'очень тяжелая'
			),
			'editmode' => 'Режим редактирования задачи',
			'createmode' => 'Режим создания задачи',
			'edit_status' => 'Изменить статус',
			'quick_call' => 'Введите номер задачи и нажмите Enter'
		);
}

// material icons
$icons = array(
	'board' => 'picture_in_picture',
	'locked' => 'https',
	'assign' => 'supervisor_account',
	'terms' => 'date_range',
	'close' => 'close',
	'logo' => 'developer_board',
	'addtask' => 'add_to_photos',
	'edit' => 'create',
	'activate' => 'system_update_alt',
	'access' => 'add_circle_outline',
	'up' => 'keyboard_arrow_up',
	'down' => 'keyboard_arrow_down',
	'info' => 'info',
	'task_info' => 'insert_comment',
	'assign_task' => 'Task assignment',
	'link' => 'link',
	'mask' => 'invert_colors',
	'layer' => 'layers',
	'layer_off' => 'layers_clear',
	'mask_off' => 'invert_colors_off',
	'move' => 'open_with',
	'draw' => 'brush',
	'write' => 'border_color',
	'opacity' => 'blur_on',
	'eraser' => 'backspace',
	'undo' => 'undo',
	'redo' => 'redo',
	'left' => 'keyboard_arrow_left',
	'right' => 'keyboard_arrow_right',
	'tooltip' => 'help_outline',
	'tooltip2' => 'help',
	'open' => 'open_in_new',
	'back' => 'arrow_back',
	'forward' => 'arrow_forward',
	'sad' => 'sentiment_dissatisfied',
	'settings' => 'settings',
	'checked' => 'done',
	'time' => 'schedule',
	'list' => 'list',
	'user' => 'free_breakfast',
	'add' => 'add',
	'add_user' => 'person_add',
	'person' => 'person'
);

// ui elements icons
$icons['ui'] = array(
	'button' => 'crop_16_9',
	'link' => 'open_in_new',
	'image' => 'wallpaper',
	'list' => 'list',
	'table' => 'border_all',
	'form' => 'comment'
);

// task element material icons
$icons['task_el'] = array(
	'mark' => 'location_on',
	'selection' => 'select_all',
	'descr' => 'chat_bubble_outline',
	'ui' => 'view_list',
	'area' => 'crop_5_4',
	'pageproto' => 'view_day',
	'drawing' => 'format_paint',
	'record' => 'touch_app'
	//'del' => 'crop_5_4'
);

// task element actions material icons
$icons['task_elac'] = array(	
	'cut' => 'content_cut',
	'bind' => 'link',
	'lock' => 'lock_outline',
	'fix' => 'flag',
	'find' => 'search',
	'here' => 'play_for_work',
	'center' => 'center_focus_weak',	
	'insert' => 'system_update_alt',
	'remove' => 'do_not_disturb_alt'
);

// task importance material icons
$icons['task_imp'] = array(
	'burning' => 'whatshot',
	'urgent' => 'flash_on',
	'important' => 'alarm',
	'usual' => 'schedule',
	'insignificant' => 'hourglass_empty'
);

// task type material icons
$icons['task_type'] = array(
	'design' => 'palette',
	'prototype' => 'dashboard',
	'text' => 'text_fields',
	'html' => 'code',
	'style' => 'format_color_fill',	
	'frontend' => 'dvr',
	'backend' => 'storage',	
	'test' => 'done_all',
	'page' => 'content_copy',	
	'project' => 'web',
	'sysadm' => 'settings_input_component' 
);

// task action material icons
$icons['task_act'] = array(
	'developing' => 'tab_unselected',
	'editing' => 'mode_edit',
	'remaking' => 'loop',
	'removing' => 'block',
	'repairing' => 'build',
	'debugging' => 'tune',
	'planning' => 'content_paste'
);

// main menu material icons
$icons['menu'] = array(
	'tasks' => 'assignment_late',
	'my_account' => 'person',
	'projects' => 'layers',
	'users' => 'people',
	'logout' => 'exit_to_app'
);

$dictionary = array('dict' => $data, 'icons' => $icons);