/*****************************************************************
 * list.c: Generic pointed list implementation module
 *
 *    Copyright (C) 2004 Luis Alberto Giménez <algibe@teleline.es>
 *
 *    This program is free software; you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation; either version 2 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program; if not, write to the Free Software
 *    Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 *
 * $Id: list.c,v 1.5 2004/09/04 02:43:18 alberto Exp $
 *
 * ***************************************************************/

#include <stdlib.h>
#include <stdio.h>
#include "list.h"

struct node {
	struct node *next;	/* next node */
	void *info;				/* list element */
};

struct List {
	struct node *first;	/* first node */
	struct node *ptr;		/* Interest point. It points to the element
									before the Current. If it's NULL, it is
									pointing to the right of the list
								*/
	list_objdupfn objdup;		/* object copy */
	list_objfreefn objfree;	/* object free */
};
	
static const char rcsid[]="$Id: list.c,v 1.5 2004/09/04 02:43:18 alberto Exp $";
/*****************************************
 * Private functions
 * *************************************/
/* creates a new node */
static struct node *node_create (void)
{
	struct node *new;

	new = malloc (sizeof (struct node));
	if (new == NULL)
		return NULL;
	
	new->next = new->info = NULL;

	return new;
}

#if 0
/* deletes a node and its info */
static void node_delete (struct node *nod)
{
	if (nod->info != NULL)
		free (nod->info);

	free (nod);
	nod = NULL;
}
#endif
/********************************************/

/* creates a void list for elems of SIZE bytes long.
 * Returns NULL if not enough memory */
list *list_create (list_objdupfn objdup, list_objfreefn objfree)
{
	list *l;
	struct node *dummy;		/* first fake element, to act as 
										the first "previous" to current. */

	l = malloc (sizeof (struct List));
	if (l == NULL)
		return NULL;

	dummy = node_create ();
	if (dummy == NULL) {
		free (l);
		return NULL;
	}
		
	l->ptr = dummy;
	l->first = dummy;
	l->objdup = objdup;
	l->objfree = objfree;

	return l;
}


/* destroys an entire list. Returns -1 if list is empty */
int list_destroy (list *lst)
{
	struct node *tmp, *aux;

	if (lst == NULL)
		return -1;
	/* delete all nodes */
	tmp = lst->first;
	aux = tmp->next;
	while (tmp != NULL) {
		lst->objfree (tmp->info);
		free (tmp);
		tmp = aux;
		if (tmp != NULL)
			aux = tmp->next;
	}

	free (lst);
	lst = NULL;
	return 0;
}



/*
 * Adds an ITEM before the point of interest. It remains in the same
 * object it was pointing before insert operation.
 * Returns 0 on exit, -1 on error.
 */
int list_insert (list *lst, void *item)
{
	struct node *new;

	new = node_create ();
	if (new == NULL) 
		return -1;

	new->info = lst->objdup (item);
	if (new->info == NULL) {
		free (new);
		return -1;
	}

	new->next = lst->ptr->next;	/* link with Current */
	lst->ptr->next = new;
	lst->ptr = new; /* new previous to Current */

	return 0;
}


/*
 * Deletes Current item, "moving" Current to the next element.
 * Returns 0 if ok, -1 if empty or end of list 
 */
int list_delete (list *lst)
{
	struct node *cur;		/* "Current" node */

	cur = lst->ptr->next;
	if (cur == NULL)
		return -1;
	
	lst->ptr->next = cur->next;
	lst->objfree (cur->info);
	free (cur);

	return 0;
}


/*
 * Returns Current element, or NULL if Current pointer is in the right. 
 */
void *list_current (list *lst)
{

	if (lst->ptr->next != NULL)
		return lst->ptr->next->info;

	return NULL;
}


/*
 * returns 1 if list is empty, 0 otherwise
 */
int list_empty (list *lst)
{
	/* With this implementation, first element is the dummy
	 * one, so a list will be empty if there's no next to dummy.*/
	return (lst->first->next == NULL);
}


/**************************************************************
 * Current item pointer handling
 * ************************************************************/

/* 
 * Move Current pointer to the first element of the list (rewind)
 * or to the right of the list if empty
 */
void list_reset (list *lst)
{
	lst->ptr = lst->first;	/* dummy is the previous of Current */
}


/*
 * Move Current pointer to the next element. Returns 0 if ok, -1 if
 * Current points to the right of the list
 */
int list_next (list *lst)
{
	if (lst->ptr->next == NULL) /* there is next */
		return -1;

	lst->ptr = lst->ptr->next;
	return 0;
}


/*
 * Returns 1 if Current item is the last of the list, 0 otherwise
 */
int list_end (list *lst)
{
	return (lst->ptr->next == NULL);
}

/***************************************************************/


