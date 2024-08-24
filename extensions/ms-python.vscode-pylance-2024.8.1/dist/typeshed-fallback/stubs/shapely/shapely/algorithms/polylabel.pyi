from ..errors import TopologicalError as TopologicalError
from ..geometry import Point, Polygon

class Cell:
    x: float
    y: float
    h: float
    centroid: Point
    distance: float
    max_distance: float
    def __init__(self, x: float, y: float, h: float, polygon: Polygon) -> None: ...
    def __lt__(self, other: Cell) -> bool: ...
    def __le__(self, other: Cell) -> bool: ...
    def __eq__(self, other: object) -> bool: ...
    def __ne__(self, other: object) -> bool: ...
    def __gt__(self, other: Cell) -> bool: ...
    def __ge__(self, other: Cell) -> bool: ...

def polylabel(polygon: Polygon, tolerance: float = 1.0) -> Point: ...
