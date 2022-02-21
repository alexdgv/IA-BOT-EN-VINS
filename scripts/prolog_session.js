const CHATBOT = String.raw `
:- dynamic(regle_rep/4).
:- use_module(library(lists)).
:- use_module(library(random)).

/* --------------------------------------------------------------------- */
/*                                                                       */
/*        PRODUIRE_REPONSE(L_Mots,L_Lignes_reponse) :                    */
/*                                                                       */
/*        Input : une liste de mots L_Mots representant la question      */
/*                de l'utilisateur                                       */
/*        Output : une liste de liste de lignes correspondant a la       */
/*                 reponse fournie par le bot                            */
/*                                                                       */
/*        NB Pour l'instant le predicat retourne dans tous les cas       */
/*            [  "je  ne sais pas.", "Les étudiants",                    */
/*               "vont m'aider, vous le verrez !"]                       */
/*                                                                       */
/*        Je ne doute pas que ce sera le cas ! Et vous souhaite autant   */
/*        d'amusement a coder le predicat que j'ai eu a ecrire           */
/*        cet enonce et ce squelette de solution !                       */
/*                                                                       */
/* --------------------------------------------------------------------- */

produire_reponse([salut], Rep) :- 
   produire_reponse_bonjour(Rep).

produire_reponse([bonjour], Rep) :- 
   produire_reponse_bonjour(Rep).

produire_reponse([coucou], Rep) :- 
   produire_reponse_bonjour(Rep).

produire_reponse_bonjour(Rep) :-   
   random_member(Bonjour, ['Bonjour Cher visiteur','Salut visiteur','Hello visiteur','Bonjour','Coucou','Salut']),
   Rep = [[Bonjour]].

produire_reponse([ca,va], Rep) :- 
   produire_reponse_cava(Rep).

produire_reponse([comment,allez,vous], Rep) :- 
   produire_reponse_cava(Rep).

produire_reponse_cava(Rep) :- 
   random_member(Comment, ['Ca va', 'Super merci', 'Je vais bien merci à vous']),
   Rep = [[Comment]].


produire_reponse([aidez,moi], Rep) :- 
   produire_reponse_aide(Rep).

produire_reponse([aide], Rep) :- 
   produire_reponse_aide(Rep).

produire_reponse_aide(Rep) :-   
   Rep = [
            ['Je réponds à vos différentes questions sur le vin. Voici différentes suggestions de questions : <br />'],
            ['<ul>'],
               ['<li> Quels vins d\'Alsace me conseillez-vous ? </li>'],
               ['<li> Quels vins de Bordeaux me conseillez-vous ? </li>'],
               ['<li> Que recouvre l\'appellation Medoc ?  </li>'],
               ['<li> Que donne le Cheverny 2019 en bouche ? </li>'],
               ['<li>Quel nez presente le Cheverny 2019 ? </li>'],
               ['<li>Pourriez-vous m\'en dire plus sur Le Perle de Wallonie ? </li>'],
               ['<li>Pour Noël j\'envisage de cuisiner des crustacés quel vin me conseillez-vous? </li>'],
               ['<li>À Noël que puis-je servir à l\'apéritif ?</li>'],
               ['<li>Vous auriez un mousseux ?</li>'],               
               ['<li>Quels vins de Provence me conseillez-vous ?</li>'],                              
            ['</ul>']
   ].


produire_reponse([allo], [['Allô ! Non mais, Allô quoi !']]) :- !. 

produire_reponse([merci], Rep) :- 
   random_member(Merci, ['Je vous en prie', 'Tout le plaisir est pour moi.', 'C\'est normal je suis là pour vous aider!']),
   Rep = [[Merci]].

produire_reponse([ciao], [[merci, de, 'm\'avoir', 'consulté']]) :- !.    
produire_reponse([a, bientot], [['Bonne journée!']]) :- !.    
produire_reponse([fin], [[merci, de, 'm\'avoir', 'consulté']]) :- !.    
produire_reponse([merci, gus], [['Je', 'vous', 'en', 'prie']]) :- !.  
produire_reponse(L,Rep) :-
   mclef(M,_), member(M,L),
   clause(regle_rep(M,_,Pattern,Rep),Body),
   match_pattern(Pattern,L),
   call(Body), !.

produire_reponse(_, [['Je', ne, comprends,pas,votre,requete]]) :- !.


match_pattern(Pattern,Lmots) :-
   nom_vins_uniforme(Lmots,L_mots_unif),
   sublist(Pattern,L_mots_unif).

match_pattern(LPatterns,Lmots) :-
   nom_vins_uniforme(Lmots,L_mots_unif),
   match_pattern_dist([100|LPatterns],Lmots_unif).

match_pattern_dist([],_).
match_pattern_dist([N,Pattern|Lpatterns],Lmots) :-
   within_dist(N,Pattern,Lmots,Lmots_rem),
   match_pattern_dist(Lpatterns,Lmots_rem).

within_dist(_,Pattern,Lmots,Lmots_rem) :-
   prefixrem(Pattern,Lmots,Lmots_rem).
within_dist(N,Pattern,[_|Lmots],Lmots_rem) :-
   N > 1, Naux is N-1,
  within_dist(Naux,Pattern,Lmots,Lmots_rem).


sublist(SL,L) :- 
   prefix(SL,L), !.
sublist(SL,[_|T]) :- sublist(SL,T).

sublistrem(SL,L,Lr) :- 
   prefixrem(SL,L,Lr), !.
sublistrem(SL,[_|T],Lr) :- sublistrem(SL,T,Lr).

prefixrem([],L,L).
prefixrem([H|T],[H|L],Lr) :- prefixrem(T,L,Lr).

nom_vins_uniforme(Lmots,L_mots_unif) :-
   L1 = Lmots,
   replace_vin([beaumes,de,venise,2015],beaumes_de_venise_2015,L1,L2),
   replace_vin([chateau,saint,simeon,2014],st_simeon_2014,L2,L3),
   replace_vin([pommard,la,chaniere,2017],pommard_la_chaniere_2017,L3,L4),
   replace_vin([ventoux,aoc,2019],ventoux_aoc_2019,L4,L5),
   replace_vin([beaune,premier,cru,2018],beaune_premier_cru_2018,L5,L6),
   replace_vin([nuit,saint,georges],nuit_saint_georges,L6,L7),   
   
   replace_vin([corton,grand,cru],corton_grand_cru,L7,L8),
   replace_vin([chablis,2020],chablis_2020,L8,L9), 
   replace_vin([chateau,petit,grillon],petit_grillon,L9,L10),
   replace_vin([vacqueyras,blanc,2019],vacqueyras_blanc_2019,L10,L11),
   replace_vin([cheverny,2019],cheverny_2019,L11,L12),
   replace_vin([bandol,2020],bandol_2020,L12,L13),
   replace_vin([syrah,2020],syrah_2020,L13,L14),
   replace_vin([les,chailloux,2020],chailloux_2020,L14,L15),
   
   replace_vin([perle,de,wallonie],perle_de_wallonie,L15,L16),   
   replace_vin([chant,d,eole],chant_d_eole,L16,L17),   
   replace_vin([cremant,d,alsace],cremant_d_alsace,L17,L18),   
   replace_vin([champagne,madame,de,maintenon],champagne_madame_de_maintenon,L18,L19),   

   replace_vin([brut,noel,martin],brut_noel_martin,L19,L20),    
   replace_vin([romanee,conti,2017],romanee_conti_2017,L20,L21),    

   L_mots_unif = L21.
   
replace_vin(L,X,In,Out) :-
   append(L,Suf,In), !, Out = [X|Suf].
replace_vin(_,_,[],[]) :- !.
replace_vin(L,X,[H|In],[H|Out]) :-
   replace_vin(L,X,In,Out).


/*----------------------------------------------------------------------------*/
/*                                                                            */
/*                         Base de connaissance des vins                      */
/*                                                                            */
/*----------------------------------------------------------------------------*/
   
/*---------------------------- Vins Rouges -----------------------------------*/

/* ---------------------------- Romanee Conti 2017 -------------------------- */
nom(romanee_conti_2017,'Romanee Conti 2017').
prix(romanee_conti_2017, 24435.12).
couleur(romanee_conti_2017, rouge).
bouche(romanee_conti_2017, 
  [ [ 'Le fruit est sur la cerise, framboise, côté acidulé/doux. Notes balsamiques et florales. Jeune avec un côté sérieux. Boisé luxueux présent qui souligne la matière.' ]]).
nez(romanee_conti_2017, [['Nez intense clairement sur la vendange entière. Net et précis et qui allie profondeur et nuances.' ]]).
description(romanee_conti_2017, 
    [ [ 'Vin d\'exception ce grand vin de Bourgogne issu du domaine de Romanée-Conti sera la pièce maitresse de vos repas d\'exception.' ]]).
appellation(romanee_conti_2017, cote_de_nuit).   


/* ---------------------------- Beaumes-de-Venise 2015 -------------------------- */
nom(beaumes_de_venise_2015,'Beaumes-de-Venise 2015').
prix(beaumes_de_venise_2015, 12.34).
couleur(beaumes_de_venise_2015, rouge).
bouche(beaumes_de_venise_2015, 
  [ [ '2015 les aromes de fraise, de violette cotoient les nuances' ],
    [ 'de baies de genevrier, de sureau et une delicate touche' ],
    [ 'de fleur d\'oranger. Cette intensite se poursuit en' ],
    [ 'bouche avec des saveurs juteuses, racees et tres elegantes', '.' ]
  ]).
nez(beaumes_de_venise_2015, 
    [ [ nez, intensement, parfume, '.' ] 
]).
description(beaumes_de_venise_2015, 
    [ [ 'vignoble situe au sud-est des Dentelles de Montmirail', '.' ],
      [ 'grand vin', '.' ]
]).
appellation(beaumes_de_venise_2015, beaumes_de_venise).   

/* ---------------------------- Chateau Saint Simeon 2014 -------------------------- */
nom(st_simeon_2014,'Chateau Saint Simeon 2014').
prix(st_simeon_2014, 11.65).
couleur(st_simeon_2014, rouge).
description(st_simeon_2014,
   [
      ['100 pour 100 cabernet sauvignon. Ce qui est rare d\'avoir un vin du Médoc monocépage.'],
      ['C\'est la qualité des Cabernets Sauvignons, en 2014, dans cette region, qui a permit cela.']
   ]).
   bouche(st_simeon_2014,
      [
         ['Tout au long de la bouche, le vin a du volume, une très belle trame tannique et une belle densité.'],
         ['Un vin de caractère.']
      ]).
      nez(st_simeon_2014,
      [
         ['Robe très colorée avec des arômes de fruits rouges et noirs associés à une nuance empyreumatique.']
      ]).
appellation(st_simeon_2014, medoc).   

/* ---------------------------- Pommard La Chanière 2017 -------------------------- */
      nom(pommard_la_chaniere_2017,'Pommard La Chanière 2017').
      prix(pommard_la_chaniere_2017, 48.79).
      couleur(pommard_la_chaniere_2017, rouge).
      description(pommard_la_chaniere_2017,
         [
          ['Pommard, au sud de Beaune, est situé sur une butte de nature marneuse.'],
          ['Ce cru est réputé pour la production de vins puissants et colorés.'],
          ['La Chanière est une petite parcelle (un climat) de 2ha en coteaux, sur le nord de l\'appellation.']
         ]).
      bouche(pommard_la_chaniere_2017,
         [
            ['La bouche est de caractère avec des tanins fermes et élégants']
         ]).
      nez(pommard_la_chaniere_2017,
         [
            ['Belle aromatique dominée par la griotte et les notes empyreumatiques de moka et grains de café.']
         ]).      
appellation(pommard_la_chaniere_2017, pommard).                     

/* ---------------------------- Ventoux AOC 2019 -------------------------- */
         nom(ventoux_aoc_2019,'Ventoux AOC 2019').
         prix(ventoux_aoc_2019, 5.99).
         couleur(ventoux_aoc_2019, rouge).
         description(ventoux_aoc_2019,
            [
               ['Belle robe rouge grenat. Excellent avec une viande rotie ou grillée. '],
               ['Un Ventoux plein de charme, tendre et gourmand. Un maitre achat, très polyvalent.']
            ]).
         bouche(ventoux_aoc_2019,
            [
              ['En bouche, les saveurs sont fruitées, epicees et florales.'],
              ['L\'ensemble se montre souple et juteux. Bel équilibre gras, matiere, fraicheur.']
            ]).
         nez(ventoux_aoc_2019,
            [
               ['Nez intense et expressif de fruits rouges (à noyaux)'],
               ['et d\'épices (cannelle, aiguilles de pin, réglisse, etc).']
            ]).         
appellation(ventoux_aoc_2019, ventoux).            

/* ---------------------------- Beaune 1er Cru 2018 -------------------------- */
nom(beaune_premier_cru_2018,'Beaune Premier Cru 2018').
      prix(beaune_premier_cru_2018, 79.07).
      couleur(beaune_premier_cru_2018, rouge).      
      description(beaune_premier_cru_2018,
         [
          ['Nous sommes fideles depuis 2009 aux terroirs de l\'AOC Beaune qui dans cette annee '],
          ['nous offre à nouveau un vin colore. Grande longueur. Grand potentiel. Tres grande garde.']
         ]).
      bouche(beaune_1er_cru_2018,
         [
            ['En bouche les saveurs allient race puissance et gras a une remarquable onctuosite']
         ]).
      nez(beaune_1er_cru_2018,
         [
            ['Nez complexe et puissant']
         ]).
appellation(beaune_premier_cru_2018, beaune).

/* ---------------------------- Nuit-Saint-Georges -------------------------- */
nom(nuit_saint_georges,'Nuits-Saint-Georges').
      prix(nuit_saint_georges, 45.37).
      couleur(nuit_saint_georges, rouge).      
      description(nuit_saint_georges,
         [
          ['Ce vignoble comprend deux parties']
         ]).
      bouche(nuit_saint_georges,
         [
            ['Longue en bouche']
         ]).
      nez(nuit_saint_georges,
         [
            ['Nez complexe et puissant']
         ]).
appellation(nuit_saint_georges, beaune).



/*---------------------------- Vins Blancs -----------------------------------*/
/* ---------------------------- Corton Grand Cru -------------------------- */
nom(corton_grand_cru,'Corton Grand Cru').
      prix(corton_grand_cru, 69.88).
      couleur(corton_grand_cru, blanc).      
      description(corton_grand_cru,
         [
          ['Puligny-Montrachet, Chassagne-Montrachet et Aloxe-Corton sont les trois seules communes'],
          ['avec des parcelles à blancs élevées au rang de "Grands Crus".'],
          ['C\'est donc une rareté, une pépite.']
         ]).
      bouche(corton_grand_cru,
         [
            ['Un grand vin plein, complexe, long et racé. Excellent equilibre gras-fraicheur.']
         ]).
      nez(corton_grand_cru,
         [
            ['Nez intense de fruits à chair blanche associés à des nuances de fleurs et d\'agrume.']
         ]).
appellation(corton_grand_cru, corton).

/* ---------------------------- Chablis 2020 -------------------------- */

nom(chablis_2020,'Chablis 2020').
      prix(chablis_2020, 24.76).
      couleur(chablis_2020, blanc).      
      description(chablis_2020,
         [
          ['Vin d\'une grande longueur issu de la région de Bourgogne et élevé 6 mois en barriques']
         ]).
      bouche(chablis_2020,
         [
            ['En bouche, les saveurs sont complexes, avec beaucoup de race, de minéralité.']
         ]).
      nez(chablis_2020,
         [
            ['Nez intense d\'arômes de fruits du verger, associés à des nuances iodées et noisetées.']
         ]).
appellation(chablis_2020, chablis).

/*---------------------------- chateau petit grillon ---------------------------------*/    


nom(petit_grillon,'Château Petit Grillon').
      prix(petit_grillon, 22.35).
      couleur(petit_grillon, blanc).      
      description(petit_grillon,
         [
          ['Issu d\'un millésime d\'exception dans le Sauternais. Ce grand vin liquoreux ne faillit pas à la tradition des Sauternes.'],
          ['Superbe robe dorée.']
         ]).
      bouche(petit_grillon,
         [
            ['En bouche, il est profondément séveux, puissant, ample et dense.']
         ]).
      nez(petit_grillon,
         [
            ['Nez très complexe, concentré, mêlant des notes grillées et épicées'],
            ['à une touche d\'abricot séché et d\'épices (curry, romarin).']
         ]).
appellation(petit_grillon, sauterne).

/*---------------------------- Vacqueyras Blanc 2019 ---------------------------------*/    


nom(vacqueyras_blanc_2019,'Vacqueyras blanc 2019').
      prix(vacqueyras_blanc_2019, 19.19).
      couleur(vacqueyras_blanc_2019, blanc).      
      description(vacqueyras_blanc_2019,
         [
          ['Une Rareté. Seul 5 pour cent des Vacqueyras sont vinifiés en blancs.'], 
          ['Vignoble situé sur la commune de Sarrians, sur un terroir de calcaire quartzeux et marne calcaire.']
         ]).
      bouche(vacqueyras_blanc_2019,
         [
            ['Belle minéralité sous-jacente en bouche, avec du corps, du volume, du gras, et de la longueur.']
         ]).
      nez(vacqueyras_blanc_2019,
         [
            ['Nez flatteur et démonstratif, avec des arômes exotiques (ananas) et de poire avec une touche épicée.']
         ]).
appellation(vacqueyras_blanc_2019, vacqueyras).

/*---------------------------- Cheverny 2019 ---------------------------------*/    

nom(cheverny_2019,'Cheverny 2019').
      prix(cheverny_2019, 9.26).
      couleur(cheverny_2019, blanc).      
      description(cheverny_2019,
         [
          ['Vignoble entourant le célèbre Château de Cheverny, aux environs de Blois. Terroir de sables sur argiles à silex.']
         ]).
      bouche(cheverny_2019,
         [
            ['La bouche rafraichissante est minérale, de très belle vivacité.'],
            ['Idéal avec des coquillages ou des poissons pochés ou fumés.']
         ]).
      nez(cheverny_2019,
         [
            ['Nez intensément parfumé, typiquement Sauvignon où les arômes de buis et de cassis dominent.']
         ]).
appellation(cheverny_2019, cheverny).

/*---------------------------- Vins Rosés -------------------------------*/

/*---------------------------- Bandol rosé 2020 ---------------------------------*/
nom(bandol_2020,'Bandol 2020').
      prix(bandol_2020, 9.26).
      couleur(bandol_2020, rose).      
      description(bandol_2020,
         [
          ['Département du Var, le vignoble de Bandol est adossé aux collines pentues qui descendent en gradins vers la mer.'],
          ['Terroir de grès calcaires alternant avec de petits lits de marnes sableuses.'],
          ['Robe rose pâle avec une nuance Pomelo.']
         ]).
      bouche(bandol_2020,
         [
            ['La bouche de caractère développe des saveurs minérales, fruitées et épicées.']
         ]).
      nez(bandol_2020,
         [
            ['Nez intense et expressif de petits fruits rouges associés à des nuances de d\'épices et de pierres chaudes.']
         ]).
appellation(bandol_2020, bandol).

/*---------------------------- Syrah rosé 2020 ---------------------------------*/
nom(syrah_2020,'Syrah 2020').
      prix(syrah_2020, 5.37).
      couleur(syrah_2020, rose).      
      description(syrah_2020,
         [
          ['Robe pomelo. Grand éclat aromatique associant en équilibre le fruit, la minéralité et les épices.']
         ]).
      bouche(syrah_2020,
         [
            ['La bouche marie élégamment le fruit à la texture, offrant un vin harmonieux et très flatteur.']
         ]).
      nez(syrah_2020,
         [
            ['Nez associant un équilibre de fruits et d\'épices.']
         ]).
appellation(syrah_2020, syrah).

/*---------------------------- Les chailloux 2020 ---------------------------------*/
nom(chailloux_2020,'Les Chailloux 2020').
      prix(chailloux_2020, 6.84).
      couleur(chailloux_2020, rose).      
      description(chailloux_2020,
         [
          ['Robe pâle. Il laisse l\'agréable souvenir d\'un rosé très gourmand, à la fois rond et frais, au fruité intense.'],
          ['Très polyvalent, élégant et rafraîchissant.']
         ]).
      bouche(chailloux_2020,
         [
            ['En bouche, les saveurs sont fruitées, vineuses et généreuses, le tout en équilibre.']
         ]).
      nez(chailloux_2020,
         [
            ['Nez gourmand, éclatant aux arômes de fruits rouges frais associés à une nuance cuberdon.']
         ]).
appellation(chailloux_2020, rhones).


/*---------------------------- Mousseux ---------------------------------*/         

/* ---------------------------- Ruffus -------------------------- */
nom(ruffus,'Ruffus').
prix(ruffus, 17).
couleur(ruffus, bulles).      

description(ruffus,[['C\'est une bulle qui est assez généreuse, donc qui a une belle effervescence en bouche.'],
                    ['Il y a également une belle structure, une belle fraîcheur, donc, c\'est vraiment l\'idéal pour commencer un repas.']]).
bouche(ruffus,[['Ce vin est assez fruité en bouche, avec ses notes d\'agrumes qui apportent cette fraîcheur qui est vraiment très intéressante.']]).
nez(ruffus,[['Nez complexe et puissant']]).
appellation(ruffus, mousseux).

/* ---------------------------- Perle de Wallonie  -------------------------- */
nom(perle_de_wallonie,'Perle de Wallonie').
prix(perle_de_wallonie, 14).
couleur(perle_de_wallonie, bulles).      

description(perle_de_wallonie,[['Je trouve que ce deuxième vin est très rafraîchissant, très fruité,'],
                    ['et je trouve qu\'il irait très bien pour ouvrir le repas et aussi avec un plat de crustacés,'],
                    ['des moules ou des huîtres, ça irait très bien ensemble.']]).
bouche(perle_de_wallonie,[['Il est très chaleureux et très gourmand en bouche.']]).
nez(perle_de_wallonie,[['Nez complexe et puissant']]).
appellation(perle_de_wallonie, mousseux).

/* ---------------------------- Chant d'Eole  -------------------------- */
nom(chant_d_eole,'Chant d\'Eole').
prix(chant_d_eole, 19).
couleur(chant_d_eole, bulles).      

description(chant_d_eole,[['Il y a ce côté gourmand de la pomme, de la poire.'],
                     ['Ce léger côté un peu brioché également, qui vient vraiment bien harmoniser le tout.']]).
bouche(chant_d_eole,[['Peps ! Incroyable en bouche. Très très très très agréable !']]).
nez(chant_d_eole,[['Nez complexe et puissant']]).
appellation(chant_d_eole, mousseux).

/* ---------------------------- Brut  -------------------------- */
nom(brut_noel_martin,'Brut Noël MARTIN').
prix(brut_noel_martin, 15).
couleur(brut_noel_martin, bulles).      

description(brut_noel_martin,[['Élevé comme le Champagne, ce pétillant Noël MARTIN fut de nombreuses fois récompensé au niveau national et mondial pour sa qualité et son authenticité.']]).
bouche(brut_noel_martin,[['Ses arômes frais correspondent à des parfums de fleurs blanches']]).
nez(brut_noel_martin,[['Ses bulles sont nombreuses, fines et persistantes.']]).
appellation(brut_noel_martin, mousseux).



/* ---------------------------- Crémant d'Alsace  -------------------------- */
nom(cremant_d_alsace,'Crémant d\'Alsace Brut Blanc de Blancs, Kuehn').
prix(cremant_d_alsace, 13.25).
couleur(cremant_d_alsace, bulles).      

description(cremant_d_alsace,[['Né sur des terroirs proches de Colmar, ce crémant est produit avec du pinot blanc, du pinot auxerrois et du chardonnay.']]).
bouche(cremant_d_alsace,[['Bouquet tendre et raffiné, bouche délicate']]).
nez(cremant_d_alsace,[['Bulles fines.']]).
appellation(cremant_d_alsace, mousseux).


/* ---------------------------- Champagne Madame de Maintenon  -------------------------- */
nom(champagne_madame_de_maintenon,'Champagne Madame de Maintenon').
prix(champagne_madame_de_maintenon, 18.25).
couleur(champagne_madame_de_maintenon, bulles).      

description(champagne_madame_de_maintenon,[['Le Champagne Madame de Maintenon, ainsi nommé en hommage à l\'art français de la table, est élaboré en ayant à l\'esprit les apéritifs'],
                                             ['raffinés suivis d\'un accompagnement de mets de qualité. Son équilibre subtil et son élégance toute champenoise, mettront en valeur toute table gastronomique.']]).
bouche(champagne_madame_de_maintenon,[['Bouquet tendre et raffiné, bouche délicate']]).
nez(champagne_madame_de_maintenon,[['Bulles fines.']]).
appellation(champagne_madame_de_maintenon, mousseux).



/*---------------------------- Type ---------------------------------*/    
/* typpe(region, appellation) */
type(bourgogne, beaune).
type(bourgogne, pommard).
type(rhone, ventoux).
type(bordeaux, medoc).
type(rhones, beaumes_de_venise).
type(bourgogne,corton).
type(bourgogne, chablis).
type(bordeaux, sauterne).
type(cote_du_rhones, vacqueyras).
type(loire,cheverny).
type(provence,bandol).
type(provence,syrah).
type(rhone,rhones).



description(medoc, 
   [
   ['Le Médoc jouit d\'une situation géographique exceptionnelle et d\'un sous-sol unique'],
   ['Des croupes de graveleuses donne naissance à de grands vins.'],
   ['L\'assemblage de merlot, avec du cabernet-sauvignon, du cabernet franc,'],
   ['du petit verdot et du malbec donnent aux vins charme et équilibre.']
   ]).
   description(beaune, 
      [ ['Selon l\'emplacement des vignes de l\'appellation Beaune, des nuances apparaissent : '],
      ['au nord de la commune, les vins sont le plus souvent intenses et puissants. Au sud, les vins sont souples et ronds.']
      ]).
   description(pommard, 
      [ ['Il faut prendre garde aux idées toutes faites : la célébrité du Pommard au XIXème siècle lui vaut l\'image d\'un vin insistant et viril.'],
      ['En réalité, les terroirs, les vinifications et l\'âge nuancent ce portrait pour offrir un vin riche en sensibilité.'],
      ['Rouge profond, rubis pourpre foncé, sa robe aux lueurs mauves rappelle le mot de Victor Hugo :  C\'est le combat du jour et de la nuit ! .']
      ]).
   description(ventoux, 
      [ ['Cette appellation est située à l\'est de la vallée du Rhône,'],
      ['dans un secteur abrité du mistral par la chaîne des Dentelles de Montmirail, les contreforts du mont Ventoux.'],
      ['Il produit des vins très fruités caractérisés par un savant équilibre entre fraîcheur et élégance.']
      ]). 
   
   description(beaumes_de_venise, 
      [ ['Beaumes-de-Venise tire son nom des grottes (balmes en provençal) creusées dans les roches de la commune éponyme.'],
         ['L\'appellation ne produit que des rouges issus majoritairement du grenache noir.']
      ]).
   description(corton, 
      [ ['La vaste superficie du Grand Cru d\'appellation Corton et le nombre élevé des Climats expliquent les nuances constatées dans les caractères de ces vins.'],
         ['Aux nuances minérales, se marient le beurre, la pomme au four, la fougère, la cannelle et le miel.']
      ]).
      description(chablis, 
      [ ['La région autour de Chablis est un plateau calcaire datant du Jurassique, profondément entaillé par des vallées.'],
         ['Les vignes sont plantées dans un sol brun, chargé en débris calcaires de teinte beige.']
      ]).
      description(sauterne, 
      [ ['L\'appellation sauternes est située à une trentaine de kilomètres au sud de Bordeaux. '],
         ['Le vignoble repose sur un sous-sol argilo-calcaire ou calcaire, sur lequel une couche plus ou moins épaisse de graves s\'est déposée.'],
         ['L\'appellation sauternes compte plusieurs de ses propriétés dans le classification officielle des vins de Bordeaux de 1855.']
      ]).
      description(vacqueyras, 
      [ ['Le vacqueyras est un vin d\'appellation d\'origine contrôlée produit sur les communes de Sarrians et de Vacqueyras, dans le département de Vaucluse.'],
         ['Cette AOC est élaborée dans les trois couleurs, rouge, blanc et rosé. ']
      ]).
      description(cheverny, 
         [ ['Au sud de Blois, le vignoble d\'appellation cheverny appartient à la Sologne.'],
            ['Son terroir à dominante sableuse s\'étend le long de la rive gauche du fleuve jusqu\'à l\'Orléanais.']
         ]).
      description(bandol, 
         [ ['Le bandol est un vin français d\'appellation d\'origine contrôlée du vignoble de Provence.'],
         ['Il est produit autour de la ville de Bandol, dans le Var.'],
         ['Il doit sa réputation à un microclimat très favorable au cépage mourvèdre.']
         ]).
      description(syrah, 
         [ ['La syrah est un des cépages rouges les plus emblématiques de la partie septentrionale des Côtes du Rhône.'],
            ['Cépage à faible rendement, rare et précieuse, elle se cultive uniquement sur des territoires idoines et privilégiés.']
         ]).
      description(rhone, 
         [ ['Le vignoble de la vallée du Rhône est un vignoble français s\'étendant de part et d\'autre du Rhône.']
         ]).

/* ---------------------------- Phrase repas -------------------------- */

phrase_repas(poulet, ['Le poulet offre un accord savoureux avec un vin rouge tendre et fruité, sans excès de tanins']).
phrase_repas(canard, ['Le canard se marie parfaitement avec un vin rouge à la fois tannique et fruité']).
phrase_repas(boeuf, ['Le boeuf se marie parfaitement avec un vin rouge à la fois tannique et fruité']).

phrase_repas(turbot, Rep) :- 
   phrase_repas(poisson1, Rep).

phrase_repas(fletan, Rep) :- 
   phrase_repas(poisson1, Rep).

phrase_repas(poisson1, Rep) :-   
   Rep = ['Pour ce plat, il faudra choisir le vin de façon à ce qu\'il puisse révéler la fraîcheur et l\'élégance du poisson, sans dénaturer sa structure.'].
   
phrase_repas(saumon, ['Si vous ne savez quel vin accompagnera le mieux votre saumon, misez toujours sur un vin blanc jeune.']).      
phrase_repas(foiegras, ['Un vin légèrement moelleux est idéal pour déguster le foie gras, mais un blanc sec peut aussi convenir.']).   
phrase_repas(aperitif, ['Pour l\'apéritif en cette période de fête, rien ne vaut une belle bouteille de bulles ou un bon vin rosé.']).   
phrase_repas(fromage, ['Pour accompagner les fromage, nous pouvons vous conseiller une liste d\'excellents vins blanc se mariant à merveille avec tous types de fromages.']).   
phrase_repas(desserts, ['Pour accompagner les desserts, nous pouvons vous conseiller une liste d\'excellents vins blanc se mariant à merveille avec tous types de desserts.']).   
phrase_repas(crustaces, ['Pour les crustacés, un vin blanc harmonieux et opulent ou des bulles conviendront parfaitement.']).   
   
/* ---------------------------- Reponses erreur -------------------------- */
bouche(_, [[aucune, bouche, renseigne, pour, ce, vin]]).
description(_, [[aucune, description, renseigne, pour, ce, vin]]).


/* ---------------------------- Mot clefs -------------------------- */
mclef(bouche,10).
mclef(nez,10).
mclef(prix,10).
mclef(vin,5).
mclef(vins,5).
mclef(pourriez,10).
mclef(cuisiner,10).
mclef(servir,10).

mclef(concepteurs,10).

mclef(recouvre,10).
mclef(auriez,10).
mclef(conseillez, 10).

mclef(combien,10).
mclef(autres, 10).

% ----------------------------------------------------------------%
% type de vin %

region(beaune_premier_cru_2018, bourgogne).
region(nuit_saint_georges, bourgogne).

region(corton_grand_cru,bourgogne).
region(chablis_2020,bourgogne).
region(petit_grillon,bordeaux).
region(vacqueyras_blanc_2019,bourgogne).

region(cheverny_2019, loire).
region(bandol_2020,provence).
region(syrah_2020,provence).
region(chailloux_2020, rhone).

region(ruffus, wallonie).
region(perle_de_wallonie, wallonie).
region(chant_d_eole, wallonie).
region(cremant_d_alsace, alsace).
region(champagne_madame_de_maintenon, champagne). 
region(brut_noel_martin, bourgogne). 
region(romanee_conti_2017, bourgogne). 

platvin(canard, pommard_la_chaniere_2017).
platvin(canard, ventoux_aoc_2019).
platvin(poulet, beaumes_de_venise_2015).

platvin(crustaces, corton_grand_cru).
platvin(turbot,corton_grand_cru).
platvin(fletan,chablis_2020).
platvin(turbot,chablis_2020).
platvin(foiegras,petit_grillon).
platvin(desserts,petit_grillon).
platvin(fromage,petit_grillon).
platvin(foiegras,vacqueyras_blanc_2019).
platvin(desserts,vacqueyras_blanc_2019).
platvin(fromage,vacqueyras_blanc_2019).
platvin(saumon,cheverny_2019).
platvin(crustaces,cheverny_2019).
platvin(fletan,cheverny_2019).
platvin(aperitif,bandol_2020).
platvin(boeuf,syrah_2020).
platvin(aperitif,syrah_2020).
platvin(boeuf,chailloux_2020).
platvin(saumon,chailloux_2020).
platvin(boeuf,romanee_conti_2017).

platvin(crustaces,perle_de_wallonie).

platvin(aperitif, ruffus).
platvin(aperitif, perle_de_wallonie).
platvin(aperitif, chant_d_eole).
platvin(aperitif, cremant_d_alsace).
platvin(aperitif, champagne_madame_de_maintenon).
platvin(aperitif, brut_noel_martin).


% ----------------------------------------------------------------%
% Classification d'aliment %

poisson(saumon).
poisson(fletan).
poisson(turbot).
poisson(crustaces).
volaille(canard).
volaille(foiegras).
volaille(poulet).
viande(boeuf).
dessert(fromage).
dessert(desserts).
apero(aperitif).


% ----------------------------------------------------------------%

regle_rep(bouche,1,
  [ que, donne, le, Vin, en, bouche ],
  Rep ) :-
     bouche(Vin,Rep).

% ----------------------------------------------------------------%
regle_rep(vins,2,
   [ auriez,vous, des, vins, entre, X, et, Y, eur ],
   Rep) :-
 
      lvins_prix_min_max(X,Y,Lvins),
      rep_lvins_min_max(Lvins,Rep).
 
 rep_lvins_min_max([], [[ non, '.' ]]).
 rep_lvins_min_max([H|T], [ [  'Notre cave comprends entre autres :'] | L]) :-
    rep_litems_vin_min_max([H|T],L).
 
 rep_litems_vin_min_max([],[]) :- !.
 rep_litems_vin_min_max([(V,P)|L], [Irep|Ll]) :-
    nom(V,Appellation),
    Irep = [ '<li> ', Appellation, '(', P, ' EUR ) </li>' ],
    rep_litems_vin_min_max(L,Ll).
 
 prix_vin_min_max(Vin,P,Min,Max) :-
    prix(Vin,P),
    Min =< P, P =< Max.
 
 lvins_prix_min_max(Min,Max,Lvins) :-
    findall( (Vin,P) , prix_vin_min_max(Vin,P,Min,Max), Lvins ).
    

 
% ----------------------------------------------------------------%
    
regle_rep(pourriez,10,
   [ pourriez,vous, m, en, dire, plus, sur, le, Vin ],
   Rep ) :-
      description(Vin,Rep).
    

% ----------------------------------------------------------------%
  
regle_rep(nez,11,
         [ quel, nez, presente, le, Vin ],
         Rep ) :-
            nez(Vin,Rep).


% ----------------------------------------------------------------%



 regle_rep(cuisiner,12,
   [_, noel,j,envisage,de,cuisiner,_,Repas,quel,vin,me,conseillez,vous],
      Rep ) :-         
      findall(X, platvin(Repas, X), Appelconseil ),
      rep_appelvin(Appelconseil, Rep, Repas).      
         

rep_appelvin([], [[ 'Je n\'ai aucune proposition pour vous pour Noel malheureusement', '.' ]], Repas).
rep_appelvin([H|T], [Debutphrase | L], Repas) :-
      phrase_repas(Repas, Debutphrase1),
      append(Debutphrase1, [' tel que : <br> <ul>'], Debutphrase),
      appelvin([H|T],L).
            
      
appelvin([], []) :- !.

appelvin([A|List], [Irep|Ll]) :-
      nom(A,Appellation),
      couleur(A, Couleur),
      Irep = [ '<li>', Appellation, '(', Couleur, ') </li>' ],
      appelvin(List, Ll).
 

regle_rep(servir,19,
   [_, noel, que, puis, je, servir, a, l,aperitif],
            Rep ) :-         
      findall(X, platvin(aperitif, X), Appelconseil ),
      rep_appelvin(Appelconseil, Rep, aperitif).      
      

% ----------------------------------------------------------------%
  
regle_rep(concepteurs,13,
         [ qui, sont, _es, concepteurs],
         Rep ) :-
            Rep = [ ['Mes concepteurs sont Thomas et Alexis'] ].


% ----------------------------------------------------------------% 
regle_rep(recouvre,14,
      [ que, recouvre, l, appellation, Appellation ], Rep ) :-
      description(Appellation, Rep).


% ----------------------------------------------------------------% 
regle_rep(auriez,15,
      [ vous, auriez, un, Appellation ], Rep ) :-
      appellation(Nomvin, Appellation),      
      nom(Nomvin, Repvin),
      prix(Nomvin, Prixvin),
      Rep = [[  'Oui, je vous conseille le ',  Repvin, ' (', Prixvin,' EUR)' ]].


% ----------------------------------------------------------------% 
regle_rep(combien,16,
      [ combien, coute, le, Vins], Rep ) :-
      prix(Vins, Prix),
      Rep = [['Ce vin est disponible au prix de ', Prix, ' EUR la bouteille' ]].
      

% ----------------------------------------------------------------%
regle_rep(conseillez,21,
   [ quel, vin, _, Region, me, conseillez,vous],
               Rep ) :-
               conseilRegion(Region, Rep).
regle_rep(conseillez,20,
   [ quels, vin, _, Region, me, conseillez,vous],
               Rep ) :-
               conseilRegion(Region, Rep).
regle_rep(conseillez,19,
   [ quels, vins, _, Region, me, conseillez,vous],
               Rep ) :-
               conseilRegion(Region, Rep).

conseilRegion(Region, Rep) :-
      Debutphrase = [['En premier conseil, je vous propose les vins suivants :']],               
      Debutphrase2 = [['Voici le(s) vin(s) dont je dispose :']],               
      findall(X, region(X, Region), Vins),
      length(Vins,Longueur),
      ( Longueur > 3 -> take(3,Vins,Vins2) ; Vins2 = Vins),
      rep_appelregion(Vins2, Listevins),
      ( Longueur > 3 ->   append(Debutphrase, Listevins, Rep); append(Debutphrase2, Listevins, Rep)).
            
rep_appelregion([], []) :- !.

rep_appelregion([H|T], [Irep|Ll]) :-
   nom(H, Repvin),
   prix(H, Prixvin),
   Irep = ['<li>', Repvin, '(', Prixvin,' EUR la bouteille) </li>'],    
   rep_appelregion(T, Ll).                

% ----------------------------------------------------------------%


   regle_rep(autres,18,
      [ auriez,vous,d,autres, vins, de, Region],
                  Rep ) :-
         Debutphrase = [['Oui je dispose des vins suivants :']],               
         findall(X, region(X, Region), Vins ),         
         length(Vins,Longueur),
         ( Longueur > 3 -> drop(3,Vins,Vins2),rep_appelregion(Vins2, Listevins),append(Debutphrase, Listevins, Rep); Rep = [['Non, je n\'ai malheureusement pas d\'autres vins.']]).
     

     

/* --------------------------------------------------------------------- */
/*                                                                       */
/*          CONVERSION D'UNE QUESTION DE L'UTILISATEUR EN                */
/*                        LISTE DE MOTS                                  */
/*                                                                       */
/* --------------------------------------------------------------------- */

% lire_question(L_Mots) 

lire_question(Input, LMots) :- read_atomics(Input, LMots).
%lire_question(LMots) :- read_atomics(LMots).



/*****************************************************************************/
% my_char_type(+Char,?Type)
%    Char is an ASCII code.
%    Type is whitespace, punctuation, numeric, alphabetic, or special.

my_char_type(46,period) :- !.
my_char_type(X,alphanumeric) :- X >= 65, X =< 90, !.
my_char_type(X,alphanumeric) :- X >= 97, X =< 123, !.
my_char_type(X,alphanumeric) :- X >= 48, X =< 57, !.
my_char_type(X,whitespace) :- X =< 32, !.
my_char_type(X,punctuation) :- X >= 33, X =< 47, !.
my_char_type(X,punctuation) :- X >= 58, X =< 64, !.
my_char_type(X,punctuation) :- X >= 91, X =< 96, !.
my_char_type(X,punctuation) :- X >= 123, X =< 126, !.
my_char_type(_,special).


/*****************************************************************************/
% lower_case(+C,?L)
%   If ASCII code C is an upper-case letter, then L is the
%   corresponding lower-case letter. Otherwise L=C.

lower_case(X,Y) :-
	X >= 65,
	X =< 90,
	Y is X + 32, !.

lower_case(X,X).


/*****************************************************************************/
% read_lc_string(-String)
%  Reads a line of input into String as a list of ASCII codes,
%  with all capital letters changed to lower case.

read_lc_string(String) :-
   get0(Firstchar),
	lower_case(FirstChar,LChar),
	read_lc_string_aux(LChar,String).

read_lc_string_aux(10,[]) :- !.  % end of line

read_lc_string_aux(-1,[]) :- !.  % end of file

read_lc_string_aux(LChar,[LChar|Rest]) :- read_lc_string(Rest).


/*****************************************************************************/
% extract_word(+String,-Rest,-Word) (final version)
%  Extracts the first Word from String; Rest is rest of String.
%  A word is a series of contiguous letters, or a series
%  of contiguous digits, or a single special character.
%  Assumes String does not begin with whitespace.

extract_word([C|Chars],Rest,[C|RestOfWord]) :-
	my_char_type(C,Type),
	extract_word_aux(Type,Chars,Rest,RestOfWord).

extract_word_aux(special,Rest,Rest,[]) :- !.
   % if Char is special, don't read more chars.

extract_word_aux(Type,[C|Chars],Rest,[C|RestOfWord]) :-
	my_char_type(C,Type), !,
	extract_word_aux(Type,Chars,Rest,RestOfWord).

extract_word_aux(_,Rest,Rest,[]).   % if previous clause did not succeed.


/*****************************************************************************/
% remove_initial_blanks(+X,?Y)
%   Removes whitespace characters from the
%   beginning of string X, giving string Y.

remove_initial_blanks([C|Chars],Result) :-
	my_char_type(C,whitespace), !,
	remove_initial_blanks(Chars,Result).

remove_initial_blanks(X,X).   % if previous clause did not succeed.


/*****************************************************************************/
% digit_value(?D,?V)
%  Where D is the ASCII code of a digit,
%  V is the corresponding number.

digit_value(48,0).
digit_value(49,1).
digit_value(50,2).
digit_value(51,3).
digit_value(52,4).
digit_value(53,5).
digit_value(54,6).
digit_value(55,7).
digit_value(56,8).
digit_value(57,9).


/*****************************************************************************/
% string_to_number(+S,-N)
%  Converts string S to the number that it
%  represents, e.g., "234" to 234.
%  Fails if S does not represent a nonnegative integer.

string_to_number(S,N) :-
	string_to_number_aux(S,0,N).

string_to_number_aux([D|Digits],ValueSoFar,Result) :-
	digit_value(D,V),
	NewValueSoFar is 10*ValueSoFar + V,
	string_to_number_aux(Digits,NewValueSoFar,Result).

string_to_number_aux([],Result,Result).


/*****************************************************************************/
% string_to_atomic(+String,-Atomic)
%  Converts String into the atom or number of
%  which it is the written representation.

string_to_atomic([C|Chars],Number) :-
	string_to_number([C|Chars],Number), !.

string_to_atomic(String,Atom) :- 
  atom_codes(Atom,String).
  % assuming previous clause failed.


/*****************************************************************************/
% extract_atomics(+String,-ListOfAtomics) (second version)
%  Breaks String up into ListOfAtomics
%  e.g., " abc def  123 " into [abc,def,123].

extract_atomics(String,ListOfAtomics) :-
	remove_initial_blanks(String,NewString),
	extract_atomics_aux(NewString,ListOfAtomics).

extract_atomics_aux([C|Chars],[A|Atomics]) :-
	extract_word([C|Chars],Rest,Word),
	string_to_atomic(Word,A),       % <- this is the only change
	extract_atomics(Rest,Atomics).

extract_atomics_aux([],[]).


/*****************************************************************************/
% clean_string(+String,-Cleanstring)
%  removes all punctuation characters from String and return Cleanstring

clean_string([C|Chars],L) :-
	my_char_type(C,punctuation),
	clean_string(Chars,L), !.
clean_string([C|Chars],[C|L]) :-
	clean_string(Chars,L), !.
clean_string([C|[]],[]) :-
	my_char_type(C,punctuation), !.
clean_string([C|[]],[C]).


/*****************************************************************************/
% read_atomics(-ListOfAtomics)
%  Reads a line of input, removes all punctuation characters, and converts
%  it into a list of atomic terms, e.g., [this,is,an,example].

read_atomics(Input, ListOfAtomics) :-
	clean_string(Input,Cleanstring),
	extract_atomics(Cleanstring,ListOfAtomics).



/* --------------------------------------------------------------------- */
/*                                                                       */
/*                         PRODUIRE_REPONSE                              */
/*                                                                       */
/* --------------------------------------------------------------------- */



transformer_reponse_en_string(Li,Lo) :- 
    flatten_strings_in_sentences(Li, Lo).

flatten_strings_in_sentences([],[]).
flatten_strings_in_sentences([W|T],S) :-
    string_as_list(W, L1),
    flatten_strings_in_sentences(T,L2),
    append(L1,L2,S).

string_as_list(W,W).

/* --------------------------------------------------------------------- */
/*                                                                       */
/*             ACTIVATION DU PROGRAMME APRES COMPILATION                 */
/*                                                                       */
/* --------------------------------------------------------------------- */


`;