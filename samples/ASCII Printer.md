ASCII Printer
We've invented a small language for printing ASCII pictures. Write a program that executes this language. We will ask you to explain your solution after you've finished.

Focus on simple, well-structured code. This question is designed for you to demonstrate readable code. It is not an algorithm question, and you will not be assessed on the performance of your solution. Don’t complicate your design to optimize your solution.

Start by implementing the commands. You might not finish, so don’t implement parsing unless you have time. Don’t worry if your code is incomplete or doesn’t compile.

Feel free to run your code and look things up online, but do not use AI-powered chat or coding assistant tools (like ChatGPT, Copilot, Windsurf etc.). If you encounter a situation which isn't described by the specification below, do something reasonable and leave a comment.

Language Specification
An ASCII printer program reads and executes a newline-separated list of commands. The canvas size is fixed at 10 characters wide and 6 characters tall. Only rectangles
may be drawn, but erase may be used to modify their shape.

DRAW_RECTANGLE <fill_character> <left_x> <top_y> <right_x> <bottom_y>

Draws a rectangle filled-in with the specified character in front of all previously-drawn
rectangles. Same fill_characters can be used for multiple different rectangles.
ERASE_AREA <left_x> <top_y> <right_x> <bottom_y>

Erase the specified rectangular area from all existing rectangles, permanently modifying
their shapes.
DRAG_AND_DROP <select_x> <select_y> <release_x> <release_y>

Finds the rectangle visible at the select coordinate, and moves this rectangle on the
canvas so that the selected cell is now at the release coordinate. Draw order is preserved, meaning this does not bring the rectangle to the front.
BRING_TO_FRONT <select_x> <select_y>

Finds the rectangle visible at the select coordinate, and brings that rectangle in front of
all other rectangles.
PRINT_CANVAS

Prints the current state of the rendered canvas.
Example Program
Here is a basic program to illustrate behavior. Grid numbers, grid lines, grid colors, and
comments are added for readability; your solution does not need to support these features.
