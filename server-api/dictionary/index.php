<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
}

$lang = $_POST['lang'];

switch ($lang) {
	case 'eng':
		$data = array(
			'description' => 'Description',
			'notifications' => 'Notifications',
			'logo' => 'XTask',
			'home' => 'Home',
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
			'logout' => 'Log out',
			'enter' => 'Log in',
			'registration' => 'Registration',
			'register' => 'Register',
			'no_tasks' => 'No tasks found',
			'open_tasks' => 'Actual tasks',
			'participants' => 'Participants',
			'info' => 'My data',
			'my_tasks' => 'My tasks',
			'task_inf' => 'Task information',
			'tasks_from_me' => 'From me',
			'tasks_for_me' => 'For me',
			'all_tasks' => 'All tasks',
			'all' => 'All',
			
			'status_frozen' => 'Back burner',
			'status_closed' => 'Archive',
			'status_ready' => 'Ready',
			'status_in_work' => 'In work',
			'status_none' => 'To do',
			'status_cant_do' => 'Problematic',
			'status_delayed' => 'Deferred',

			'settings' => 'Settings',
			'create_project' => 'Create project',
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

			'frontend' => 'Frontend',
			'backend' => 'Backend',
			'fullstack' => 'Full-stack',
			'htmler' => 'HTML coder',
			'designer' => 'Designer',

			'design' => 'Design',
			'html' => 'HTML',
			'text' => 'Texts',
			'txt' => 'Text',
			'prototype' => 'Prototypes',
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
			'future' => 'For the future',
			'to_think' => 'To think',

			'closed' => 'Closed',
			'deleted' => 'Deleted',
			'ready' => 'Ready',
			'to_approve' => 'For approval',
			'to_test' => 'For testing',
			'to_check' => 'For checking',
			'delayed' => 'Delayed',
			'in_work' => 'In work',
			'cant_do' => 'Can\'t do',
			'note' => 'Note to self',

			'assign_executors' => 'Assign executors',
			'task_info' => 'Fill extended task info',

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

			'tooltip' => 'Tooltip'
		);
	break;

	default:	
		$data = array(
			'description' => 'Описание',
			'notifications' => 'Уведомления',
			'logo' => 'XTask',
			'home' => 'Главная',
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
			'title' => 'Название',
			'taskurl' => 'Адрес страниц(ы), где задача будет доступна',
			'name' => 'Имя',
			'role' => 'Роль',
			'spec' => 'Специализация',
			'email' => 'Эл. почта',
			'create_user' => 'Создать пользователя',
			'user_editing' => 'Ред. пользователя',
			'user_adding' => 'Созд. пользователя',
			'add' => 'Добавить',
			'add_task' => 'Добавить задачу',
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
			'logout' => 'Выйти',
			'enter' => 'Войти',
			'registration' => 'Регистрация',
			'register' => 'Зарегистрироваться',
			'no_tasks' => 'Задачи не найдены',
			'open_tasks' => 'Откр. задачи',
			'participants' => 'Участники',
			'info' => 'Мои данные',
			'my_tasks' => 'Мои задачи',
			'task_inf' => 'Информация о задаче',
			'tasks_from_me' => 'От меня',
			'tasks_for_me' => 'Для меня',
			'all_tasks' => 'Все задачи',

			'all' => 'Все',
			'status_frozen' => 'Долгий ящик',
			'status_closed' => 'Архив',
			'status_ready' => 'Готовые',
			'status_in_work' => 'В работе',
			'status_none' => 'Текущие',
			'status_cant_do' => 'Проблемные',
			'status_delayed' => 'Отложенные',
			
			'settings' => 'Настройки',
			'create_project' => 'Создать проект',
			'create_task' => 'Создать задачу',
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

			'frontend' => 'Frontend',
			'backend' => 'Backend',
			'fullstack' => 'Full-stack',
			'htmler' => 'Верстальщик',
			'designer' => 'Дизайнер',

			'design' => 'Дизайн',
			'html' => 'Верстка',
			'text' => 'Тексты',
			'txt' => 'Текст',
			'prototype' => 'Макеты',
			'backend' => 'Backend',
			'frontend' => 'Frontend',
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
			'note' => 'Заметка для себя',

			'burning' => 'Горящая',
			'urgent' => 'Срочная',
			'important' => 'Важная',
			'usual' => 'Обычная',
			'insignificant' => 'Незначительная',
			'future' => 'На будущее',
			'to_think' => 'На обдумывание',

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

			'tooltip' => 'Подсказка'
		);
}

// material icons
$icons = array(
	'assign' => 'supervisor_account',
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
	'open' => 'open_in_new',
	'back' => 'arrow_back',
	'forward' => 'arrow_forward',
	'sad' => 'sentiment_dissatisfied',
	'settings' => 'settings'
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
	'insignificant' => 'hourglass_empty',
	'future' => 'turned_in_not',
	'to_think' => 'timer_off'
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
	'project' => 'web'
);

// task action material icons
$icons['task_act'] = array(
	'developing' => 'tab_unselected',
	'editing' => 'mode_edit',
	'remaking' => 'loop',
	'removing' => 'block',
	'repairing' => 'build',
	'debugging' => 'tune',
	'planning' => 'content_paste',
	'note' => 'star_border'
);

// main menu material icons
$icons['menu'] = array(
	'my_account' => 'person',
	'tasks' => 'assignment_late',
	'projects' => 'layers',
	'users' => 'people',
	'logout' => 'exit_to_app'
);

die(json_encode(array('success' => true, 'dict' => $data, 'icons' => $icons)));