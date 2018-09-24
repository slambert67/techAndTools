/*  The comments in the program assume compiling in the large memory model
    where pointers default to far and are 4 bytes each.
*/

/*
    In this example, we pass the array of strings by value.  We also
    demonstrate passing multi-dimensional arrays without using a typedef.
*/
#include <stdio.h>
#include <stdlib.h>

#define numStrings 20
#define maxLen 130

void ReadStrings( char [numStrings][maxLen] );

int main ()
{
    int i;
    char bfr[numStrings][maxLen]; /* 2600 bytes on stack */

    /* The first display of the stack is 4096 - 2 - 2600 = 1494 */
    printf( "SP in function main: %u\n", _SP );

    ReadStrings( bfr );

    for( i=0; i<numStrings; i++)
        printf( bfr[i] );

    return 0;
}

void ReadStrings( char inBuf[numStrings][maxLen] )
{
    int i;
    FILE *in;
     /* Now SP is at 1494 - 6 (function overhead) - 4 (formal parameters)
        - 6 (local variables) = 1478 */
    printf( "SP in function ReadStrings: %u\n", _SP );

    in = fopen( "arrays4.c", "r" );
    if( in == NULL )
    {
        perror( "cannot open file" );
        exit( 1 );
    }

    i = 0;
    while( i<numStrings && !feof( in ) )
        fgets( inBuf[i++], maxLen, in );
    fclose( in );
}
