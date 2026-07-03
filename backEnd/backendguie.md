users
Campo	Tipo	Notas
id	uuid / PK	
username	varchar	
is_dark	boolean	
bg_type	enum(image,color)	
bg_image	text	URL
bg_color	varchar(7)	hex
accent_color	varchar(7)	hex
card_color	varchar(7)	hex
card_alpha	float	0.0 – 1.0
notifications	boolean	
print_bg	enum(white,solid)	
font_size	int	px

projects
Campo	Tipo	Notas
id	uuid / PK	
user_id	uuid / FK → users	
name	varchar	
color	varchar(7)	hex
emoji	varchar	
description	text

project_links
Campo	Tipo	Notas
id	uuid / PK	
project_id	uuid / FK → projects	
label	varchar	
url	text	

activities
Campo	Tipo	Notas
id	uuid / PK	
project_id	uuid / FK → projects	
title	varchar	
description	text	
hours	int	duración
day	int	0=Lun … 6=Dom, null si sin programar
start_hour	int	hora de inicio (7–23), null si sin programar
regularity	enum(regular,semi,única)	
priority	enum(alta,media,baja)	
note_color	varchar(7)	hex
sched_week	int	semana base en que se programó
semi_weeks	int	cuántas semanas se repite (semi)
semi_target	int	máximo de completaciones (semi, opcional)
semi_completions	int	cuántas completaciones lleva

logros (metas / logros)
Campo	Tipo	Notas
id	uuid / PK	
owner_type	enum(project,activity)	discriminador
owner_id	uuid	FK → projects o activities
title	varchar	
icon	varchar	emoji
completed	boolean	
current	int	progreso numérico (nullable)
target	int	meta numérica (nullable)
trigger_activity_id	uuid / FK → activities	auto-complete al completar actividad
trigger_count	int	cuántas veces debe completarse

activity_completions (log de actividades completadas)
Campo	Tipo	Notas
id	uuid / PK	
user_id	uuid / FK → users	
activity_id	uuid / FK → activities	
completed_at	date	para calcular racha

stickers (stickers en el dashboard)
Campo	Tipo	Notas
id	uuid / PK	
user_id	uuid / FK → users	
sticker_id	varchar	id de sticker predefinido o custom
x	float	posición X
y	float	posición Y

custom_stickers
Campo	Tipo	Notas
id	uuid / PK	
user_id	uuid / FK → users	
data_url	text	base64 o URL de storage
label	varchar	