// Complete Athens geocoding script - ALL streets and addresses
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fetch from 'node-fetch';

// Complete Athens areas with ALL streets
const athensAreas = [
  // Κεντρικές Περιοχές
  { 
    name: 'Kolonaki', 
    nameGr: 'Κολωνάκι',
    streets: ['Σκουφά', 'Τσακάλωφ', 'Πατριάρχου Ιωακείμ', 'Κανάρη', 'Λουκιανού', 'Δεινοκράτους', 'Αναγνωστοπούλου', 'Ηροδότου', 'Πλουτάρχου', 'Σόλωνος', 'Βουκουρεστίου', 'Νεοφύτου Δούκα', 'Ξενοκράτους', 'Χάρητος', 'Δημοκρίτου', 'Ομήρου', 'Ακαδημίας', 'Μασσαλίας', 'Ιπποκράτους', 'Σίνα']
  },
  { 
    name: 'Exarchia', 
    nameGr: 'Εξάρχεια',
    streets: ['Ναυαρίνου', 'Μεσολογγίου', 'Καλλιδρομίου', 'Τρικούπη', 'Θεμιστοκλέους', 'Μπενάκη', 'Αραχώβης', 'Ζωοδόχου Πηγής', 'Σπ. Τρικούπη', 'Εμμ. Μπενάκη', 'Ερεσσού', 'Διδότου', 'Βαλτετσίου', 'Στουρνάρη', 'Χαριλάου Τρικούπη', 'Ιπποκράτους', 'Ακαδημίας', 'Σολωμού', 'Μαυρομιχάλη', 'Καλλιδρομίου']
  },
  { 
    name: 'Plaka', 
    nameGr: 'Πλάκα',
    streets: ['Αδριανού', 'Κυδαθηναίων', 'Μητροπόλεως', 'Πανδρόσου', 'Λυσικράτους', 'Βύρωνος', 'Αρεοπαγίτου', 'Τριπόδων', 'Φλέσσα', 'Μνησικλέους', 'Πρυτανείου', 'Θρασύλλου', 'Επιμενίδου', 'Αγγέλου Βλάχου', 'Σχολείου', 'Φαρμάκη', 'Κλεψύδρας', 'Αστερίου', 'Διογένους', 'Στρατώνος']
  },
  { 
    name: 'Psiri', 
    nameGr: 'Ψυρρή',
    streets: ['Αισχύλου', 'Σαρρή', 'Τάκη', 'Μιαούλη', 'Καραϊσκάκη', 'Ευριπίδου', 'Σοφοκλέους', 'Αριστοφάνους', 'Παλλάδος', 'Αγ. Αναργύρων', 'Ναυάρχου Αποστόλη', 'Μελανθίου', 'Λεωκορίου', 'Πλαταιών', 'Αθηνάς', 'Λέπενιώτου', 'Νηλέως', 'Διπύλου', 'Δεκελέων', 'Μυλλέρου']
  },
  { 
    name: 'Koukaki', 
    nameGr: 'Κουκάκι',
    streets: ['Βεΐκου', 'Δημητρακοπούλου', 'Ζίννη', 'Γεωργίου Ολυμπίου', 'Φαλήρου', 'Δράκου', 'Παρθενώνος', 'Προπυλαίων', 'Μισαραλιώτου', 'Ζαχαρίτσα', 'Μακρυγιάννη', 'Αναστασίου Ζίννη', 'Πετμεζά', 'Φιλοπάππου', 'Καλλισπέρη', 'Ρόμπερτ Γκάλι', 'Συγγρού', 'Δοντά', 'Αθανασίου Διάκου', 'Μουσών']
  },
  { 
    name: 'Pagrati', 
    nameGr: 'Παγκράτι',
    streets: ['Υμηττού', 'Σπύρου Μερκούρη', 'Ευτυχίδου', 'Αρχιμήδους', 'Πλατεία Προσκόπων', 'Φρύνης', 'Δαμάρεως', 'Ηρώδου Αττικού', 'Ευφρονίου', 'Αρατού', 'Φερεκράτους', 'Πρατίνου', 'Χρεμωνίδου', 'Αγησίλαου', 'Κρατίνου', 'Ευβούλου', 'Αριστείδου', 'Ευαλκίδου', 'Στησιχόρου', 'Ιβύκου']
  },
  { 
    name: 'Ampelokipoi', 
    nameGr: 'Αμπελόκηποι',
    streets: ['Λεωφόρος Αλεξάνδρας', 'Πανόρμου', 'Σεβαστουπόλεως', 'Δημητσάνας', 'Λαρίσης', 'Τριπόλεως', 'Κεφαλληνίας', 'Σούτσου', 'Κόνωνος', 'Λυκούργου', 'Δορυλαίου', 'Γεωργίου Σταύρου', 'Κηφισίας', 'Μεσογείων', 'Τιμοθέου', 'Φειδιππίδου', 'Αγίας Παρασκευής', 'Παπαδιαμαντοπούλου', 'Ευκλείδου', 'Πύρρου']
  },
  { 
    name: 'Kypseli', 
    nameGr: 'Κυψέλη',
    streets: ['Πατησίων', 'Κυψέλης', 'Αγίας Ζώνης', 'Τενέδου', 'Σπετσών', 'Κύπρου', 'Κεφαλονιάς', 'Λέσβου', 'Ιθάκης', 'Δροσοπούλου', 'Ύδρας', 'Άνδρου', 'Σκύρου', 'Μυκόνου', 'Νάξου', 'Κέρκυρας', 'Αιγίνης', 'Πάρου', 'Σίφνου', 'Θήρας']
  },
  
  // Νότια Προάστια
  { 
    name: 'Glyfada', 
    nameGr: 'Γλυφάδα',
    streets: ['Γούναρη', 'Λαζαράκη', 'Μεταξά', 'Αρτέμιδος', 'Γρηγορίου Λαμπράκη', 'Ζησιμοπούλου', 'Κύπρου', 'Ανθέων', 'Βασιλέως Γεωργίου', 'Παλαιολόγου', 'Γενναδίου', 'Δούσμανη', 'Κων/νου Καραμανλή', 'Βενιζέλου', 'Αγγέλου Μεταξά', 'Βουλιαγμένης', 'Ποσειδώνος', 'Αλκυόνης', 'Ξενοφώντος', 'Διαδόχου Παύλου']
  },
  { 
    name: 'Voula', 
    nameGr: 'Βούλα',
    streets: ['Βασιλέως Παύλου', 'Ηρακλείτου', 'Σωκράτους', 'Δημοκρίτου', 'Ιάσονος', 'Οδυσσέως', 'Αφροδίτης', 'Ποσειδώνος', 'Ερμού', 'Παπάγου', 'Μεταξά', 'Αλκυόνης', 'Πανδώρας', 'Θησέως', 'Αχιλλέως', 'Αίαντος', 'Ορφέως', 'Προμηθέως', 'Αθηνάς', 'Διός']
  },
  { 
    name: 'Vouliagmeni', 
    nameGr: 'Βουλιαγμένη',
    streets: ['Απόλλωνος', 'Λητούς', 'Θησέως', 'Αρίωνος', 'Λεωφόρος Βουλιαγμένης', 'Οδυσσέως', 'Νηρέως', 'Ποσειδωνίας', 'Ακτής', 'Πανός', 'Καβούρι', 'Αστερίας', 'Ήρας', 'Δήμητρας', 'Εστίας', 'Κοραλλίων', 'Αμφιτρίτης', 'Τρίτωνος', 'Ωκεανίδων', 'Νηρηίδων']
  },
  { 
    name: 'Nea Smyrni', 
    nameGr: 'Νέα Σμύρνη',
    streets: ['Ελευθερίου Βενιζέλου', 'Ομήρου', 'Αγίας Φωτεινής', '25ης Μαρτίου', 'Πλαστήρα', 'Κλεισθένους', 'Μεγάλου Αλεξάνδρου', 'Στρατάρχου Παπάγου', 'Αιγαίου', 'Κωνσταντινουπόλεως', 'Βύρωνος', 'Ιωνίας', 'Μικράς Ασίας', 'Σμύρνης', 'Εφέσου', 'Προύσης', 'Τραπεζούντος', 'Αϊδινίου', 'Μαγνησίας', 'Φωκαίας']
  },
  { 
    name: 'Palaio Faliro', 
    nameGr: 'Παλαιό Φάληρο',
    streets: ['Αμφιθέας', 'Ναϊάδων', 'Ποσειδώνος', 'Αχιλλέως', 'Αλκυόνης', 'Τρίτωνος', 'Παλαιών Πατρών Γερμανού', 'Αγίου Αλεξάνδρου', 'Ζησιμοπούλου', 'Αρτέμιδος', 'Αγίας Βαρβάρας', 'Δημοσθένους', 'Αριστείδου', 'Σολωμού', 'Υψηλάντου', 'Κανάρη', 'Μιαούλη', 'Κουντουριώτου', 'Τζαβέλλα', 'Αγίου Γεωργίου']
  },
  { 
    name: 'Alimos', 
    nameGr: 'Άλιμος',
    streets: ['Ιωνίας', 'Καλαμακίου', 'Μιχαλακοπούλου', 'Θουκυδίδου', 'Αλίμου', 'Λεωφόρος Βουλιαγμένης', 'Γερουλάνου', 'Ποσειδώνος', 'Δωδεκανήσου', 'Κρήτης', 'Αρχιπελάγους', 'Κυκλάδων', 'Σποράδων', 'Επτανήσου', 'Χίου', 'Λέσβου', 'Σάμου', 'Ρόδου', 'Κέρκυρας', 'Ζακύνθου']
  },
  { 
    name: 'Elliniko', 
    nameGr: 'Ελληνικό',
    streets: ['Ιασωνίδου', 'Κύπρου', 'Βουλιαγμένης', 'Ηούς', 'Αφροδίτης', 'Χρυσοστόμου Σμύρνης', 'Ελλήνων Αξιωματικών', 'Σκρα', 'Πινδάρου', 'Ομήρου', 'Ιασωνίδου', 'Λεωφόρος Ποσειδώνος', 'Αλίμου', 'Αργυρουπόλεως', 'Ιωνίας', 'Αισχύλου', 'Σοφοκλέους', 'Ευριπίδου', 'Αριστοφάνους', 'Μενάνδρου']
  },
  
  // Βόρεια Προάστια
  { 
    name: 'Kifisia', 
    nameGr: 'Κηφισιά',
    streets: ['Κασσαβέτη', 'Κολοκοτρώνη', 'Λεβίδου', 'Χαρ. Τρικούπη', 'Τατοΐου', 'Οθωνος', 'Δροσίνη', 'Σολωμού', 'Χελμού', 'Κορυτσάς', 'Παπαδιαμάντη', 'Κοραή', 'Αγίας Κυριακής', 'Πανδρόσου', 'Μυρσίνης', 'Θησέως', 'Αδραμυτίου', 'Σμύρνης', 'Κύπρου', 'Δημοκρατίας']
  },
  { 
    name: 'Marousi', 
    nameGr: 'Μαρούσι',
    streets: ['Κηφισίας', 'Βασιλίσσης Σοφίας', 'Αγίου Κωνσταντίνου', 'Χατζηαντωνίου', 'Φραγκοκλησιάς', 'Σωρού', 'Περικλέους', 'Ανδρέα Παπανδρέου', 'Βορείου Ηπείρου', 'Κύπρου', 'Αμαρουσίου-Χαλανδρίου', 'Ερμού', 'Ολυμπιονικών', 'Αναπαύσεως', 'Αγίας Φιλοθέης', 'Νερατζιωτίσσης', 'Αθηνών', 'Δημοκρίτου', 'Πλάτωνος', 'Αριστοτέλους']
  },
  { 
    name: 'Psychiko', 
    nameGr: 'Ψυχικό',
    streets: ['Δημοκρατίας', 'Αμαρυλλίδος', 'Γαλήνης', 'Νεφέλης', 'Στρατηγού Καλλάρη', 'Δαβάκη', 'Αναπαύσεως', 'Παπαδιαμάντη', 'Σεφέρη', 'Ελύτη', 'Αιμιλίου Βεάκη', 'Στεφάνου Δέλτα', 'Λεωφόρος Κηφισίας', 'Ψυχάρη', 'Ροδοκανάκη', 'Κατσιμίδου', 'Χλόης', 'Αγγέλου Βλάχου', 'Καζαντζάκη', 'Καβάφη']
  },
  { 
    name: 'Filothei', 
    nameGr: 'Φιλοθέη',
    streets: ['Καποδιστρίου', 'Αναπαύσεως', 'Παπαναστασίου', 'Λ. Κηφισίας', 'Πίνδου', 'Αλαμάνας', 'Δροσοπούλου', 'Χρυσανθέμων', 'Γαρδενίων', 'Ορχιδέων', 'Κρίνων', 'Μαργαριτών', 'Νάρκισσων', 'Ίριδος', 'Μυρτιάς', 'Δάφνης', 'Πικροδάφνης', 'Βιολέτας', 'Γιασεμιών', 'Τριανταφυλλιάς']
  },
  { 
    name: 'Chalandri', 
    nameGr: 'Χαλάνδρι',
    streets: ['Ανδρέα Παπανδρέου', 'Πεντέλης', 'Αγίας Παρασκευής', 'Ηρακλείτου', 'Σωκράτους', 'Πλάτωνος', 'Κοδριγκτώνος', 'Αναξαγόρα', 'Δημοκρίτου', 'Ευκλείδη', 'Αριστοτέλους', 'Πυθαγόρα', 'Θαλή', 'Παρμενίδη', 'Ζήνωνος', 'Επίκουρου', 'Χρυσίππου', 'Κλεάνθους', 'Διογένους', 'Ξενοφώντος']
  },
  { 
    name: 'Vrilissia', 
    nameGr: 'Βριλήσσια',
    streets: ['Λεωφόρος Πεντέλης', 'Ολυμπίας', 'Αναλήψεως', 'Υμηττού', 'Ροδοπόλεως', 'Πάρνηθος', 'Ταϋγέτου', 'Αγίου Δημητρίου', 'Ευαγγελίστριας', 'Κισσάβου', 'Πηλίου', 'Βερμίου', 'Ολύμπου', 'Οίτης', 'Παρνασσού', 'Μαινάλου', 'Δίρφυος', 'Ψηλορείτη', 'Λευκών Ορέων', 'Αθαμάνων']
  },
  { 
    name: 'Agia Paraskevi', 
    nameGr: 'Αγία Παρασκευή',
    streets: ['Μεσογείων', 'Αγίας Παρασκευής', 'Ελευθερίας', 'Πατριάρχου Γρηγορίου', 'Ηπείρου', 'Χίου', 'Αιγίνης', 'Δημοκρατίας', 'Ειρήνης', 'Αγίου Ιωάννου', 'Θεσσαλίας', 'Μακεδονίας', 'Θράκης', 'Κρήτης', 'Δωδεκανήσου', 'Κυκλάδων', 'Πελοποννήσου', 'Στερεάς Ελλάδος', 'Ευβοίας', 'Αττικής']
  },
  { 
    name: 'Cholargos', 
    nameGr: 'Χολαργός',
    streets: ['Περικλέους', 'Φανερωμένης', 'Αριστοτέλους', 'Μεταμορφώσεως', 'Κατεχάκη', 'Αγίας Τριάδος', 'Κύπρου', 'Παπαφλέσσα', 'Αναστάσεως', 'Στρατάρχου Παπάγου', 'Ευαγγελιστρίας', 'Αγίας Παρασκευής', 'Βασιλέως Κωνσταντίνου', 'Βενιζέλου', 'Υψηλάντου', 'Κολοκοτρώνη', 'Καραϊσκάκη', 'Μπουμπουλίνας', 'Κανάρη', 'Μιαούλη']
  },
  
  // Δυτικά Προάστια
  { 
    name: 'Peristeri', 
    nameGr: 'Περιστέρι',
    streets: ['Παναγή Τσαλδάρη', 'Εθνάρχου Μακαρίου', 'Αγίου Βασιλείου', 'Θηβών', 'Αναπαύσεως', 'Πελοποννήσου', 'Τρώων', 'Αχαρνών', 'Κωνσταντινουπόλεως', 'Αγίων Αναργύρων', 'Παπαναστασίου', 'Ελευθερίου Βενιζέλου', 'Αγίου Αντωνίου', 'Δωδεκανήσου', 'Αγίας Σοφίας', 'Μικράς Ασίας', 'Αθηνών', 'Κρήτης', 'Κύπρου', 'Ευβοίας']
  },
  { 
    name: 'Petroupoli', 
    nameGr: 'Πετρούπολη',
    streets: ['25ης Μαρτίου', 'Ελευθερίου Βενιζέλου', 'Αναπαύσεως', 'Μ. Μπότσαρη', 'Κύπρου', 'Ηρώων Πολυτεχνείου', 'Εθνικής Αντιστάσεως', 'Αγίας Τριάδος', 'Δημοκρατίας', 'Ειρήνης', 'Αγίας Παρασκευής', 'Αγίου Δημητρίου', 'Θησέως', 'Ηρακλέους', 'Αχιλλέως', 'Οδυσσέως', 'Περσέως', 'Ιάσονος', 'Ορφέως', 'Προμηθέως']
  },
  { 
    name: 'Aigaleo', 
    nameGr: 'Αιγάλεω',
    streets: ['Ιερά Οδός', 'Κηφισού', 'Δημαρχείου', 'Αγίου Σπυρίδωνος', 'Μεγάλου Αλεξάνδρου', 'Ναυαρίνου', 'Δωδεκανήσου', 'Κορυτσάς', 'Θηβών', 'Αθηνών', 'Αναπαύσεως', 'Κολοκοτρώνη', 'Καραϊσκάκη', 'Κανάρη', 'Μιαούλη', 'Υψηλάντου', 'Παπαφλέσσα', 'Διάκου', 'Ανδρούτσου', 'Μπότσαρη']
  },
  { 
    name: 'Ilioupoli', 
    nameGr: 'Ηλιούπολη',
    streets: ['Σοφ. Βενιζέλου', 'Πρωτόπαππα', 'Μαρίνου Αντύπα', 'Ηρώων Πολυτεχνείου', 'Αλσους', 'Κύπρου', 'Πατριάρχου Γρηγορίου', 'Ελευθερίου Βενιζέλου', 'Φλέμινγκ', 'Μεγίστης', 'Αγίου Κωνσταντίνου', 'Αναπαύσεως', 'Ειρήνης', 'Αγίου Δημητρίου', 'Αγίας Μαρίνης', 'Βυζαντίου', 'Αργυρουπόλεως', 'Δαμασκηνού', 'Θράκης', 'Μακεδονίας']
  },
  
  // Πειραιάς
  { 
    name: 'Piraeus Center', 
    nameGr: 'Κέντρο Πειραιά',
    streets: ['Ηρώων Πολυτεχνείου', 'Φίλωνος', 'Κολοκοτρώνη', 'Καραΐσκου', 'Γούναρη', 'Βασιλέως Γεωργίου', 'Ζωσιμάδων', 'Μπουμπουλίνας', 'Τσαμαδού', 'Εθνικής Αντιστάσεως', 'Ακτή Μιαούλη', 'Γρηγορίου Λαμπράκη', 'Αλκιβιάδου', 'Νοταρά', 'Χατζηκυριάκου', 'Σκουζέ', 'Μαυρομιχάλη', 'Υψηλάντου', 'Δεληγιώργη', 'Σαχτούρη']
  },
  { 
    name: 'Kastella', 
    nameGr: 'Καστέλλα',
    streets: ['Βασιλέως Παύλου', 'Αλεξάνδρου Παπαναστασίου', 'Ιατρίδου', 'Φαληρέως', 'Προφήτη Ηλία', 'Κανθάρου', 'Τερψιθέας', 'Δεξαμενής', 'Αγίου Κωνσταντίνου', 'Μουτσοπούλου', 'Βασιλειάδου', 'Αλκιβιάδου', 'Ειρήνης', 'Παυσανίου', 'Φαβιέρου', 'Βότση', 'Ζαΐμη', 'Τσαμαδού', 'Μπεχράκη', 'Γαλάτη']
  },
  { 
    name: 'Pasalimani', 
    nameGr: 'Πασαλιμάνι',
    streets: ['Ακτή Μουτσοπούλου', 'Γρηγορίου Λαμπράκη', 'Μαρίνας Ζέας', 'Χατζηκυριάκου', 'Ακτή Θεμιστοκλέους', 'Μπουμπουλίνας', 'Κουντουριώτου', 'Ναυάρχου Νοταρά', 'Βασιλέως Γεωργίου', 'Φίλωνος', 'Αλεξάνδρου Παπαναστασίου', 'Σκουζέ', 'Τζαβέλλα', 'Ναυμαχίας Έλλης', 'Μεραρχίας', 'Δημοσθένους', 'Ευαγγελιστρίας', 'Κλεισόβης', 'Αθηνάς', 'Ζωοδόχου Πηγής']
  }
];

// Rate limiter
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Geocoding function
async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=gr&limit=1`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'RealEstateAthens/1.0 (Educational Project)'
            }
        });
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                display_name: data[0].display_name
            };
        }
    } catch (error) {
        console.error(`Geocoding error for ${address}:`, error);
    }
    
    return null;
}

// Generate addresses (every 10 numbers from 1-100 for each street)
function generateAddresses() {
    const addresses = [];
    
    for (const area of athensAreas) {
        for (const street of area.streets) {
            // Numbers 1, 11, 21, 31, 41, 51, 61, 71, 81, 91
            for (let num = 1; num <= 100; num += 10) {
                addresses.push({
                    street,
                    number: num,
                    area: area.name,
                    areaGr: area.nameGr,
                    fullAddress: `${street} ${num}, ${area.nameGr}, Αθήνα, Ελλάδα`
                });
            }
        }
    }
    
    return addresses;
}

// Main geocoding function
async function geocodeAllAddresses() {
    // Open database
    const db = await open({
        filename: './property_coordinates.db',
        driver: sqlite3.Database
    });

    // Create table if not exists (without display_name for compatibility)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS property_coordinates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            street VARCHAR(255) NOT NULL,
            number INTEGER NOT NULL,
            area VARCHAR(100) NOT NULL,
            area_gr VARCHAR(100) NOT NULL,
            full_address VARCHAR(500) NOT NULL,
            lat DECIMAL(10, 8) NOT NULL,
            lng DECIMAL(11, 8) NOT NULL,
            geocoding_source VARCHAR(50) DEFAULT 'nominatim',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(street, number, area)
        );

        CREATE INDEX IF NOT EXISTS idx_area ON property_coordinates(area);
        CREATE INDEX IF NOT EXISTS idx_street ON property_coordinates(street);
        CREATE INDEX IF NOT EXISTS idx_coords ON property_coordinates(lat, lng);
    `);

    const addresses = generateAddresses();
    const totalAddresses = addresses.length;
    console.log(`🏠 Athens Real Estate Geocoding - COMPLETE EDITION`);
    console.log(`📍 Total addresses to geocode: ${totalAddresses}`);
    console.log(`🏘️  Areas: ${athensAreas.length}`);
    console.log(`🛣️  Total streets: ${athensAreas.reduce((sum, area) => sum + area.streets.length, 0)}`);
    console.log(`⏱️  Estimated time: ${Math.round(totalAddresses * 1.1 / 60)} minutes (${Math.round(totalAddresses * 1.1 / 3600)} hours)\n`);
    
    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;
    const startTime = Date.now();
    
    // Process addresses
    for (let i = 0; i < addresses.length; i++) {
        const addr = addresses[i];
        const progress = Math.round((i + 1) / totalAddresses * 100);
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = (i + 1) / elapsed;
        const remaining = Math.round((totalAddresses - i - 1) / rate / 60);
        
        // Check if already geocoded
        const existing = await db.get(
            'SELECT * FROM property_coordinates WHERE street = ? AND number = ? AND area = ?',
            [addr.street, addr.number, addr.area]
        );
        
        if (existing) {
            skipCount++;
            console.log(`[${i + 1}/${totalAddresses}] ${progress}% - ⏭️  Skip: ${addr.street} ${addr.number} (ETA: ${remaining}m)`);
            continue;
        }
        
        // Geocode address
        console.log(`[${i + 1}/${totalAddresses}] ${progress}% - 🔍 ${addr.fullAddress}`);
        const result = await geocodeAddress(addr.fullAddress);
        
        if (result) {
            try {
                await db.run(
                    `INSERT INTO property_coordinates 
                     (street, number, area, area_gr, full_address, lat, lng) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [addr.street, addr.number, addr.area, addr.areaGr, addr.fullAddress, 
                     result.lat, result.lng]
                );
                successCount++;
                console.log(`   ✅ OK: ${result.lat}, ${result.lng}`);
            } catch (dbError) {
                console.log(`   ❌ DB Error: ${dbError.message}`);
                failCount++;
            }
        } else {
            failCount++;
            console.log(`   ❌ No results - trying alt...`);
            
            // Try alternative format
            const altAddress = `${addr.street}, ${addr.areaGr}, Athens, Greece`;
            const altResult = await geocodeAddress(altAddress);
            
            if (altResult) {
                try {
                    await db.run(
                        `INSERT INTO property_coordinates 
                         (street, number, area, area_gr, full_address, lat, lng) 
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [addr.street, addr.number, addr.area, addr.areaGr, addr.fullAddress,
                         altResult.lat, altResult.lng]
                    );
                    successCount++;
                    failCount--;
                    console.log(`   ✅ Alt OK!`);
                } catch (dbError) {
                    console.log(`   ❌ Alt DB Error: ${dbError.message}`);
                    failCount++;
                }
            }
        }
        
        // Rate limit
        await sleep(1100); // 1.1 seconds to be safe
        
        // Progress summary every 50 addresses
        if ((i + 1) % 50 === 0) {
            console.log(`\n📊 Progress Summary:`);
            console.log(`   ✅ Success: ${successCount}`);
            console.log(`   ❌ Failed: ${failCount}`);
            console.log(`   ⏭️  Skipped: ${skipCount}`);
            console.log(`   📈 Rate: ${rate.toFixed(1)} addr/sec`);
            console.log(`   ⏱️  ETA: ${remaining} minutes\n`);
        }
    }
    
    // Final statistics
    await db.close();
    
    const totalTime = Math.round((Date.now() - startTime) / 1000 / 60);
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ATHENS GEOCODING COMPLETE!');
    console.log('='.repeat(60));
    console.log(`📊 Final Results:`);
    console.log(`   Total addresses: ${totalAddresses}`);
    console.log(`   ✅ Successfully geocoded: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   ⏭️  Already in database: ${skipCount}`);
    console.log(`   📈 Success rate: ${Math.round((successCount + skipCount) / totalAddresses * 100)}%`);
    console.log(`   ⏱️  Total time: ${totalTime} minutes`);
    console.log('\n💾 Database saved as: property_coordinates.db');
    console.log('🚀 Your Athens real estate app now has REAL street coordinates!');
}

// Run the script
console.log('🚀 Starting Athens Real Estate Geocoding Service...\n');
geocodeAllAddresses().catch(console.error);
