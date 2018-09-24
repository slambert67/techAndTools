#include <stdio.h>
#include <conio.h>

void func1()
{
  /* getchar reads a single char from stdin. Carriage return is required.
     This is called line buffered input. */

  int c;

  printf("Enter a character : ");
  c = getchar();
  putchar(c);
}

void func2()
{
  /* multiple char before carriage return */

  int c;

  printf("Enter some characters : ");
  c = getchar();
  putchar(c);
  c = getchar();
  putchar(c);
  c = getchar();
  putchar(c);
  c = getchar();
  putchar(c);

}

void func3()
{
  /* Non line buffered io. Carriage return is not required */

  int c;

  printf("Enter a character : ");
  c = _getch();
  putchar(c);
}

void func4()
{
  int c;

  printf("Enter a character : ");
  while ( (c = getchar()) != EOF )
  {
    /* don't put output here cos fucks up getchar */
    putchar(c);
  }
}

void func5()
{
  int c = EOF;

  printf("EOF = %d\n", c);
}

void main()
{
  /* Read and print one character */
  /* func1(); */ 

  /* Read and print several characters */
  /* func2(); */

  /* Non line buffered input */
  /* func3(); */

  /* Read chars until EOF */
  /* func4();*/

  /* Excercise 1_7. What is EOF */
  func5();


}