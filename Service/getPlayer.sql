select
	ID,
	ID_Area

from
	Player

where
	ID = :ID_Player

limit 1