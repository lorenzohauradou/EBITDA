# 📊 EBITDA Dashboard

Una dashboard moderna e intuitiva per gestire i tuoi progetti e monitorare il fatturato in tempo reale.

## ✨ Caratteristiche

### 🏗️ Gestione Progetti

- **Visualizzazione dinamica** dei progetti attivi con layout a cards
- **Aggiunta progetti** con titolo, pagamento cliente e descrizione
- **Task management** con stato di completamento
- **Calcolo automatico** del progresso e dei guadagni

### 📈 Analytics in Tempo Reale

- **Fatturato totale** che si aggiorna automaticamente
- **Barra di progresso** generale con animazioni fluide
- **Statistiche dettagliate**: progetti attivi, media per progetto
- **Attività recenti** con tracking delle azioni
- **Card metriche** con efficienza e traguardi

### 🎨 Design e UX

- **Design responsivo** con Tailwind CSS
- **Animazioni smooth** al completamento dei task
- **Effetti hover** e transizioni dinamiche
- **Icone Font Awesome** per una UX intuitiva
- **Gradienti colorati** e design moderno

### ⚡ Funzionalità Avanzate

- **Persistenza dati** con localStorage
- **Coriandoli animati** al completamento progetti
- **Vibrazione haptic** (se supportata dal dispositivo)
- **Calcoli automatici** di guadagni e progressi

## 🚀 Come Iniziare

1. **Clona o scarica** il progetto
2. **Apri** il file `index.html` in un browser moderno
3. **Inizia** a gestire i tuoi progetti!

## 📋 Utilizzo

### Creare un Nuovo Progetto

1. Clicca su "**Nuovo Progetto**"
2. Inserisci **titolo**, **pagamento cliente** e **descrizione**
3. **Personalizza i task**:
   - Modifica i task predefiniti (già precompilati)
   - Cambia il nome dei task
   - Ajusta le percentuali (vengono calcolati automaticamente i valori in €)
   - Aggiungi nuovi task con il pulsante "Aggiungi Task"
   - Rimuovi task non necessari con il pulsante "×"
4. Il sistema distribuisce automaticamente i valori se le percentuali non sommano a 100%
5. Clicca "**Crea Progetto**" per salvare

### Gestire i Task

- **Clicca sul cerchio** accanto al task per segnarlo come completato
- **Aggiungi task** usando il pulsante "+" nel progetto
- **Elimina task** con il pulsante "×"
- Guarda le **analytics aggiornarsi** in tempo reale

### Monitorare il Progresso

- **Fatturato totale** si aggiorna automaticamente
- **Barra di progresso** mostra il completamento generale
- **Attività recenti** traccia tutte le tue azioni
- **Cards statistiche** forniscono insights dettagliati

## 🎯 Funzionalità Dettagliate

### Panel Sinistro - Progetti

- Lista progetti con informazioni complete
- Progress bar per ogni progetto
- Task con stato visivo (completati/da fare)
- Riepilogo guadagni (guadagnato vs rimanente)
- Azioni rapide (aggiungi/elimina task e progetti)

### Panel Destro - Analytics

- **Card Fatturato**: totale guadagnato e task completati
- **Barra Progresso**: completamento generale con percentuale
- **Stats Grid**: progetti attivi e media per progetto
- **Attività Recenti**: cronologia azioni con timestamp
- **Traguardi**: task completati, progetti finiti, efficienza

## 🛠️ Tecnologie Utilizzate

- **HTML5** - Struttura semantica
- **CSS3** - Stili personalizzati e animazioni
- **Tailwind CSS** - Framework CSS utility-first
- **JavaScript ES6+** - Logica applicativa moderna
- **Font Awesome** - Icone professionali
- **localStorage** - Persistenza dati locale

## 📱 Responsive Design

La dashboard è ottimizzata per:

- 💻 **Desktop** - Layout a tre colonne
- 📱 **Mobile** - Layout a colonna singola
- 📟 **Tablet** - Layout adattivo

## ⚙️ Personalizzazione

Il progetto è facilmente personalizzabile:

- **Colori**: modifica i gradienti nelle classi CSS
- **Animazioni**: personalizza le transizioni nel CSS
- **Task predefiniti**: modifica la funzione `createProject()`
- **Metriche**: aggiungi nuove analytics in `updateAnalytics()`

## 🔧 Struttura File

```
EBITDA/
├── index.html          # Pagina principale
├── script.js           # Logica JavaScript
└── README.md          # Documentazione
```

## 💡 Idee per Miglioramenti Futuri

- [ ] Esportazione dati in CSV/PDF
- [ ] Grafici con Chart.js
- [ ] Sistema di notifiche
- [ ] Backup su cloud
- [ ] Timer per tracking tempo
- [ ] Categorie progetti
- [ ] Dashboard amministratore

## 🎨 Design Philosophy

Il design segue principi di:

- **Semplicità**: interfaccia pulita e intuitiva
- **Efficienza**: azioni rapide e feedback immediato
- **Modernità**: design contemporaneo con animazioni fluide
- **Accessibilità**: contrasti appropriati e navigazione keyboard-friendly

## 📊 Demo Data

Il progetto include dati di esempio:

- 3 progetti campione
- Task con diversi stati di completamento
- Analytics pre-popolate per dimostrazioni

---

**Sviluppato con ❤️ per semplificare la gestione progetti e il monitoraggio fatturato**
