/***************************************************************
 * test.c: Test program to show how list.c module works.
 * 
 * Just link list.o module to your program and you will have all its
 * facilities:
 *
 * gcc -o your_program your_program.c list.o
 *
 * Luis Alberto Giménez 2004
 * ************************************************************/
#include <stdlib.h>		/* malloc */
#include <stdio.h>
#include "list.h"		/* function definitiosn */


/* duplicate a list element */
void *dup_int(void *x)
{
	int *intptr;

	if ((intptr = malloc (sizeof (int))) != NULL)
		*intptr = * (int *)x;

	return intptr;
}

/* free list element */
void free_int(void *x)
{
	free (x);
}
	
/* prints list contents */
void list_print (list *l)
{

	int i = 1;
	puts("\nWill do a listwalk");
	list_reset(l);
	while (!list_end(l)) {
		printf ("Node %d (%p):\n", i, (int *)list_current(l));
		printf (" -> Item: %d\n\n", *(int *)list_current(l));
		list_next(l);
		i++;
	}

	fflush (stdout);
}


void add_int (list *l, int *x)
{
	printf ("Adding int %d... ", *x);
	list_insert (l, x);
	puts ("OK");
}

int main(void)
{
	list *l;
	int anint;

	printf("Creating list... ");
	l = list_create(dup_int, free_int);
	puts("OK");
	
	printf("List is %s\n", list_empty(l) ? "empty" : "not empty");
	anint = 2;
	add_int(l, &anint);

	anint = 3;
	add_int(l, &anint);

	anint = 4;
	add_int(l, &anint);

	anint = 5;
	add_int(l, &anint);
	
	printf("List is %s\n", list_empty(l) ? "empty" : "not empty");
	list_print (l);

	/* Current is in the end of the list now */
	printf ("Current is %s\n", list_end(l) ? "in the end" :
															"not in the end");

	/* rewind */
	list_reset(l);
	puts("List reset");

	/* current should be 2 */
	printf ("Current is %s\n", list_end(l) ? "in the end" :
															"not in the end");
	printf ("Current is %d\n", * (int *)list_current(l));

	puts ("Will delete 3");
	list_reset(l);	/* current is 2 */
	list_next(l);	/* current is 3 */
	list_delete(l);
	list_print(l);		/* should print 2 4 5 */

	/* check if Current is in the end */
	if (list_end(l))
		puts("Pointer is in the right of list!");
	else
		printf ("Current is %d\n", * (int *)list_current(l));

	/* add again 3 */
	list_reset(l); /* points to 2 */
	list_next(l);	/* 4 */
	anint = 3;
	add_int(l, &anint);
	list_print(l);		/* should print 2 3 4 5, Current is 4 */
	
	/* delete all the items */
	list_reset(l);
	while (!list_empty(l)) {
		list_delete(l);
	}
	list_print(l);

	/* will test inserts in the middle, beginning and end of the list */
	list_reset(l);
	/* add 1 and 2 */
	for (anint = 1; anint < 3; anint++)
		add_int(l, &anint);

	if (list_end(l))
		puts("Current is still in the end");
	else
		puts("Current should be in the end but it's not!");

	/* add in the beginning */
	anint = -1;
	list_reset(l);
	add_int(l, &anint);

	/* jump until the end */
	while (!list_end(l))
		list_next(l);

	anint = 3;
	add_int(l, &anint);
	list_print(l);			/* should be -1 1 2 3 */
	
	list_destroy (l);

	return 0;
}
