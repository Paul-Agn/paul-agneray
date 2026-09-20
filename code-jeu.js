/* Code C du jeu du Bandit Manchot (affiché dans l'onglet « Lire le code C »). Colle ici ton code à la place. */
const CODE_JEU = String.raw`#include <cs50.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>
#include <string.h>

//permet d'écrire CITRON pour obtenir l'émojie citron au lieu de U0001F34B, etc...
#define CITRON "\U0001F34B"
#define SEPT "7\uFE0F\u20E3"
#define CERISE "\U0001F352"
#define BAR "\U0001F6A7"
//permet de remonter une ligne dans le terminal pour écrire le tableau colonnes les unes après les autres
#define ESPACE "\033[C"
#define REMONTER_LIGNE "\033[F"

/*
permet le comptage des gains, en comparant les valeur des rouleau par rapport au combinaisons gagnantes
prend en parametres la matrice du bandit manchot, et les 3 chiffres aléatoires genérés
*/
int comptage(string l_tab_rouleau[3][11], int aleatoire0, int aleatoire1, int aleatoire2);

/*
delais pour l'affichage des colonnes, les unes apres les autres pour creer du suspens
prend en parametre le temps de pause en secondes souhaité
*/
void delay(int x_duree);

/*
permet de ranger les 3 symboles du cylindre obtenu a partir d'un nombre aléatoires entre 0 et 10 (rand()%11), et le symbole précédent et suivant pour chacun,
ensuite elle affiche les résultats sous forme de colonnes les unes après les autres avec un delais de 1 sec,
prend la matrice du bandit manchot tiré a l'aide des nb aléatoires et la range dans un nouveau tableau, aleatoire_sup_inf permet d'obtenir le symbole précedent et suivant, tps et le delais entre les affichages des colonnes

*/
void affichage(string l_tab_rouleau[3][11],string tab_tirage[3][3], int aleatoire0, int aleatoire1, int aleatoire2, int aleatoire_sup_inf, int tps);

/*
permet d'afficher les combinaisons gagnantes à l'écran ainsi que le capital actuel du joueur,
Nécessaire car beaucoup de clear console dans le programme
prend en parametres le capital du jouer, il n'est pas mit a jour dans la fonction
*/
void combinaisons(int capital);

int main(void)
{
    /*
    permet de générer un nombre aléatoire
    */
    srand(time(NULL));
    //déclaration des variables
    int capital = 100;
    int mise = 0;
    int gain = 0;
    int penalite = 0;
    int conserver_rouleaux = 0;
    int aleatoire_sup_inf;
    char start;
    char restart;
    int aleatoire0, aleatoire1, aleatoire2;
    //passage du tableau de char a string car les emoji utilisent Unicode qui est une suite de caractères
  string l_tab_rouleau[3][11] = {{CITRON, SEPT, CERISE, BAR, CITRON, CERISE, CITRON, CITRON, CERISE, CITRON, BAR},
                                 {CITRON, CERISE, SEPT, CITRON, CERISE, CITRON, BAR, CERISE, CITRON, SEPT, CERISE},
                                 {CITRON, BAR, CITRON, CERISE, CITRON, SEPT, CERISE, CITRON, BAR, CERISE, CITRON}};

  //  string l_tab_rouleau[3][11] = {{SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT},
    //                             {SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT},
      //                           {SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT, SEPT}};
    string tab_tirage[3][3];

    //permet de clear le terminal
    system("clear");

    //appelle la fonction combinaison avec le capital du joueur en paramètre
    combinaisons(capital);

    //saisie sécuriée de la mise 1/2/3 et pas autre chose
    do
    {
        mise = get_int("Entrez votre mise (1/2/3): ");
    }
    while (mise != 1 && mise != 2 && mise != 3);

    //printf \n pour optmiser la lisibilité du rendu affiché dans le terminal en améliorant l'espacement et la structuration des éléments
    printf("\n");

    //saisie sécuriée de la mise J/j et pas autre chose
    do
    {
        start = get_char("Appyer sur J pour lancer le Jeu :\n");
    }
    while(start !='J' && start != 'j');

    //permet de clear le terminal
    system("clear");

    //fonction do while pour pouvoir effectuer au moins une fois un tour du Bandit Manchot avant le restart potentiel (O/N)
    do
    {
        //retire la mise du capital du joueur
        capital -= mise;
        //met a jour le captial et affiche les gains
        combinaisons(capital);

        //permet de récuperer le symbole précédent le résultat du joueur
        //photo : https://www.bing.com/images/search?view=detailV2&ccid=TVF2M50d&id=D3DC82400E880E6531D680D6C6E6FC3360AB0C6C&thid=OIP.TVF2M50dZ3Q9te7dtttZHAHaD8&mediaurl=https%3a%2f%2frobotphoto.reception-maelys.fr%2fwp-content%2fuploads%2f2018%2f10%2fbandit-manchot.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4d5176339d1d67743db5eeddb6db591c%3frik%3dbAyrYDP85sbWgA%26pid%3dImgRaw%26r%3d0&exph=400&expw=750&q=bandit+manchot&FORM=IRPRST&ck=1CE92E5781BABEFFEC8F219B72B6270E&selectedIndex=2&itb=0&ajaxhist=0&ajaxserp=0
        aleatoire_sup_inf = -1;
        //récupère une valeur aléatoire pour le premier, le deuxieme et le troisieme symbole
        aleatoire0 = rand() % 11;
        aleatoire1 = rand() % 11;
        aleatoire2 = rand() % 11;
        //appelle de la fonction affichage qui récupère les symbole correspondant au nnombre aléatoire dans l_tab_rouleau et affiche de manière verticale comme le vrai bandit manchot
        affichage (l_tab_rouleau, tab_tirage, aleatoire0, aleatoire1, aleatoire2, aleatoire_sup_inf, 1);

        // compare les symbole entre eux pour ne pas demander le relancer si les 3 symboles sont identiques
        if(!(strcmp(l_tab_rouleau[0][aleatoire0], l_tab_rouleau[1][aleatoire1]) == 0 && strcmp(l_tab_rouleau[1][aleatoire1], l_tab_rouleau[2][aleatoire2]) == 0))
        {
            //demande si on souhaite relancer 1 ou deux rouleaux et recrée le nouveau résultat avec un nouveau nombre aléatoire et réemploie affichage(), il conserve le même rouleaux restants
            do
            {
            conserver_rouleaux = get_int("Relancer un ou plusieurs rouleaux ? (ex : 0 pour aucun, 1 pour le premier, etc...) \n-%d points/rouleau \n --> ", mise);
            }
            while(conserver_rouleaux != 0 && conserver_rouleaux !=1 && conserver_rouleaux !=2 && conserver_rouleaux !=3 && conserver_rouleaux !=12 && conserver_rouleaux !=13 && conserver_rouleaux !=23);

            system("clear");

            switch(conserver_rouleaux)
            {
                case 1 :
                    aleatoire0 = rand() % 11;
                    penalite = mise;
                    capital = capital - penalite;
                    combinaisons(capital);
                    affichage(l_tab_rouleau, tab_tirage, aleatoire0, aleatoire1, aleatoire2, aleatoire_sup_inf, 1);
                    break;

                case 2 :
                    aleatoire1 = rand() % 11;
                    penalite = mise;
                    capital = capital - penalite;
                    combinaisons(capital);
                    affichage(l_tab_rouleau, tab_tirage, aleatoire0, aleatoire1, aleatoire2, aleatoire_sup_inf, 1);
                    break;

                case 3 :
                    aleatoire2 = rand() % 11;
                    penalite = mise;
                    capital = capital - penalite;
                    combinaisons(capital);
                    affichage(l_tab_rouleau, tab_tirage, aleatoire0, aleatoire1, aleatoire2, aleatoire_sup_inf, 1);
                    break;

                case 12 :
                    aleatoire0 = rand() % 11;
                    aleatoire1 = rand() % 11;
                    penalite = mise*2;
                    capital = capital - penalite;
                    combinaisons(capital);
                    affichage(l_tab_rouleau, tab_tirage, aleatoire0, aleatoire1, aleatoire2, aleatoire_sup_inf, 1);
                    break;

                case 13 :
                    aleatoire0 = rand() % 11;
                    aleatoire2 = rand() % 11;
                    penalite = mise*2;
                    capital = capital - penalite;
                    combinaisons(capital);
                    affichage(l_tab_rouleau, tab_tirage, aleatoire0, aleatoire1, aleatoire2, aleatoire_sup_inf, 1);
                    break;

                case 23 :
                    aleatoire1 = rand() % 11;
                    aleatoire2 = rand() % 11;
                    penalite = mise*2;
                    capital = capital - penalite;
                    combinaisons(capital);
                    affichage(l_tab_rouleau, tab_tirage, aleatoire0, aleatoire1, aleatoire2, aleatoire_sup_inf, 1);
                    break;

                case 0 :
                    combinaisons(capital);
                    affichage(l_tab_rouleau, tab_tirage, aleatoire0, aleatoire1, aleatoire2, aleatoire_sup_inf, 0);
                    break;

                default :
                    return 1;
            }
        }

        //permet le contage des points en fonction des combinaisons obtenues
        gain = comptage(l_tab_rouleau, aleatoire0, aleatoire1, aleatoire2);

        //afiche le gain et met a jour le nouveau captial
        printf("Gain : %d\n", mise * gain);
        capital = capital + mise * gain;

        //affiche le nouveau captial si le gain est positif
        if (gain != 0)
        {
        printf("Nouveau Capital : %d\n\n", capital);
        }

        //demande un restart et sécurise la saisie Oo ou Nn
        do
        {
            restart = get_char("Restart ? O/N\n");
        }
        while(restart !='O' && restart != 'N' && restart != 'o' && restart != 'n');

        system("clear");

    }
    while(restart=='O' || restart=='o');

    return 0;
}





int comptage(string l_tab_rouleau[3][11], int aleatoire0, int aleatoire1, int aleatoire2)
{
    if ((strcmp(l_tab_rouleau[0][aleatoire0],SEPT) ==0)  && (strcmp(l_tab_rouleau[1][aleatoire1],SEPT) == 0) && (strcmp(l_tab_rouleau[2][aleatoire2],SEPT) == 0))
    {
        return 500;
    }
    else if ((strcmp(l_tab_rouleau[0][aleatoire0],BAR) == 0)  && (strcmp(l_tab_rouleau[1][aleatoire1],BAR) == 0) && (strcmp(l_tab_rouleau[2][aleatoire2],BAR) == 0))
    {
        return 250;
    }
    else if ((strcmp(l_tab_rouleau[0][aleatoire0],CERISE) == 0) && (strcmp(l_tab_rouleau[1][aleatoire1],CERISE) == 0) && (strcmp(l_tab_rouleau[2][aleatoire2],CERISE) == 0))
    {
        return 10;
    }
    else if ((strcmp(l_tab_rouleau[0][aleatoire0],CITRON) == 0) && (strcmp(l_tab_rouleau[1][aleatoire1],CITRON) == 0)  && (strcmp(l_tab_rouleau[2][aleatoire2],CITRON) == 0))
    {
        return 5;
    }
    else if ((strcmp(l_tab_rouleau[0][aleatoire0],CITRON)== 0)  && (strcmp(l_tab_rouleau[1][aleatoire1],CITRON) == 0))
    {
        return 1;
    }
    else if (strcmp(l_tab_rouleau[0][aleatoire0],CITRON)  ==  0)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}


void affichage(string l_tab_rouleau[3][11], string tab_tirage[3][3], int aleatoire0, int aleatoire1, int aleatoire2, int aleatoire_sup_inf, int tps)
{
    for (int i = 0; i < 3; i++)
        {
            tab_tirage[i][0] = l_tab_rouleau[0][(aleatoire0 + aleatoire_sup_inf + 11) % 11];
            tab_tirage[i][1] = l_tab_rouleau[1][(aleatoire1 + aleatoire_sup_inf + 11) % 11];
            tab_tirage[i][2] = l_tab_rouleau[2][(aleatoire2 + aleatoire_sup_inf + 11) % 11];
            aleatoire_sup_inf += 1;
        }
        printf("\n");

    for (int j = 0; j < 3; j++)
    {
        delay(tps);
        printf("%s\n", tab_tirage[0][j]);
        if(j == 1)
        {
            printf(ESPACE ESPACE ESPACE ESPACE);
        }
        else if(j == 2)
        {
            printf(ESPACE ESPACE ESPACE ESPACE ESPACE ESPACE ESPACE ESPACE);
        }


        printf("%s\n", tab_tirage[1][j]);
        if(j == 1)
        {
            printf(ESPACE ESPACE ESPACE ESPACE);
        }
        else if(j == 2)
        {
            printf(ESPACE ESPACE ESPACE ESPACE ESPACE ESPACE ESPACE ESPACE);
        }


        printf("%s", tab_tirage[2][j]);
        if(j == 0)
        {
            printf(REMONTER_LIGNE REMONTER_LIGNE ESPACE ESPACE ESPACE ESPACE);
        }
        else if(j == 1)
        {
            printf(REMONTER_LIGNE REMONTER_LIGNE ESPACE ESPACE ESPACE ESPACE ESPACE ESPACE ESPACE ESPACE);
        }
    }


    printf("\n");
    printf("\n");

//    for(int i = 0; i<3; i++)
  //  {
    //    printf("[0][i] %s\n", tab_tirage[0][i]);
      //  printf("[1][i] %s\n", tab_tirage[1][i]);
        //printf("[2][i] %s\n", tab_tirage[2][i]);
   // }

}


void delay(int x_duree)
{
	int l_int_debut = 0;
    sleep(x_duree);
}


void combinaisons(int capital)
{
    printf("Combinaisons Gagnantes :\n");
    printf("%s    %s    %s   =>  mise x 500 (0,15%% chance de gain)\n", SEPT, SEPT, SEPT);
    printf("%s   %s   %s  =>  mise x 250 (0,3%% chance de gain)\n", BAR, BAR, BAR);
    printf("%s   %s   %s  =>  mise x 25 (1,5%% chance de gain)\n", CERISE, CERISE, CERISE);
    printf("%s   %s   %s  =>  mise x 10 (7%% chance de gain)\n", CITRON, CITRON, CITRON);
    printf("%s   %s    Ø  =>  mise x 8 (9%% chance de gain)\n", CITRON, CITRON);
    printf("%s    Ø    Ø  =>  mise x 4 (16%% chance de gain)\n", CITRON);
    printf("\nCapital : %d \n", capital);
}
`;
