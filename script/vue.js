const content = new Vue({
  el: "#app",
  data: {
    title: "Anniversaires",
    searchplaceholder: "Rechercher une personne",
    firstname: '',
    lastname: '',
    date: '',
    dateformated: '',
    picture: '',
    picturein: '',
    choice: '',
    years: [],
    aged: '',
    gift: '',
    year: '',
    update: false,
    whatsearch: '',
    whosearch: '',
    birthdaygift: [],
    birthdaylist: [],
    daysleft: '',
    yourage: '',
    showaddform: false,
    showdetails: false,
    showaddformgift: false,
    daysleft: '',
    phonenumber: '',
    email: '',
    showuser: false,
  },
  methods: {
    //Prochain Age
    next: function (base) {
      return base + 1
    },
    //Jours Restant jusqu'au prochain anniversaie 
    countdown: function (day) {
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const thedate = day.split('-');
      var actu = new Date();
      var annee = actu.getFullYear();
      var mois = thedate[1];
      var anni = new Date(thedate[2] + "-" + monthNames[mois - 1] + "-" + annee);
      var intervalle = anni.getTime() - actu.getTime();
      intervalle = Math.floor(intervalle / (1000 * 60 * 60 * 24));
      if ((intervalle) == -1) {
        numberleft = 0
      } else {
        if (intervalle < -1) {
          numberleft = intervalle + 366;
        } else
          numberleft = intervalle + 1;
      }
      return numberleft;
    },
    //Calcul de l'age actuel
    age: function (day) {
      const thedate = day.split('-');
      var today = new Date();
      var an = thedate[0];
      var mois = thedate[1]
      var day = thedate[2]
      var dateNaissance = new Date(an + "-" + mois + "-" + day);
      var age = today.getFullYear() - dateNaissance.getFullYear();
      var m = today.getMonth() - dateNaissance.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dateNaissance.getDate())) {
        age = age - 1;
      }
      return age
    },
    //Formatage de la date au format fran??ais
    formatdate: function () {
      const monthNames = ["Janvier", "F??vrier", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Ao??t", "Spetembre", "Octobre", "Novembre", "D??cembre"
      ];
      const thedate = this.date.split('-');
      var an = thedate[0];
      var mois = thedate[1]
      var day = thedate[2]
      return day + " " + monthNames[mois - 1] + " " + an
    },
    //Gestion de l'upload d'image, compression et enregistrement en base 64
    onFileSelected(event) {
      const compressor = new window.Compress();
      let reader = new FileReader();
      reader.onload = function () {  
      const files = [...event.target.files];
      const results = compressor.compress(files, {
        size: 4,
        quality: 0.1,
      });  
      results.then((value)=>{
        let image = value
        let theimg = "data:image/jpeg;base64,"+image[0].data
        localStorage.setItem("images", JSON.stringify(theimg));
      })
      };
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
        localStorage.removeItem("images");
      }
    },
    //G??n??ration automatique des dates pour la liste de choix dans la partie offrir un cadeau
    dategenerator: function () {
      this.years = []
      const thedate = this.date.split('-');
      const curentDate = new Date();
      for (let index = curentDate.getFullYear(); index > thedate[0]; index--) {
        this.years.push({
          date: index,
        })
      }
    },
    //Ajouter un cadeau
    addagift: function () {
      this.showaddformgift = false,
        this.update = true;
      this.birthdaygift.push({
          date: this.year,
          gift: this.gift
        }),
        //Tri du tableau en fontion du crit??re choisi
        this.birthdaygift.sort(function (x, y) {
          let a = new Date(x.date),
            b = new Date(y.date);
          return b - a;
        });
        //R??initialisation des indexs du tableau
        for (var i = 0; i < this.birthdaygift.length; i++) {
          if (this.birthdaygift[i].id != i) {
            this.birthdaygift[i].id = i;
          }
        }
        this.year = '',
        this.gift = ''
      this.birthdaylist[this.choice].push(this.birthdaygift)
      this.years=""
    },
    //G??n??ration des id
    generateid: function () {
      length = this.birthdaylist.length
      return length
    },
    //Ajouter un membre
    addamemember: function () {
      this.birthdaylist.push({
        id: this.generateid(),
        firstname: this.firstname,
        lastname: this.lastname,
        date: this.date,
        dateleft: this.countdown(this.date),
        email: this.email,
        phonenumber: this.phonenumber,
        yourage: this.age(this.date),
        picture: JSON.parse(localStorage.getItem("images")) != null ? JSON.parse(localStorage.getItem("images")) : "https://alainmerucci.fr/projets-acs/whatforurbday/images/avatar.png",
        cadeau: []
      })
      this.birthdaylist.sort(function (x, y) {
        let a = new Date(x.dateleft),
          b = new Date(y.dateleft);
        return a - b;
      });
      for (var i = 0; i < this.birthdaylist.length; i++) {
        if (this.birthdaylist[i].id != i) {
          this.birthdaylist[i].id = i;
        }
      }
      localStorage.setItem("birthdaylist", JSON.stringify(this.birthdaylist));
      this.showaddform = false,
        this.reset(),
        localStorage.removeItem("images");
    },
    //Supprimer un membre
    deleteMember() {
      who = this.choice
      this.birthdaylist.splice(who, 1)
      this.birthdaylist.sort(function (x, y) {
        let a = new Date(x.dateleft),
          b = new Date(y.dateleft);
        return a - b;
      });
      for (var i = 0; i < this.birthdaylist.length; i++) {
        if (this.birthdaylist[i].id != i) {
          this.birthdaylist[i].id = i;
        }
      }
      localStorage.setItem('birthdaylist', JSON.stringify(this.birthdaylist))
    },
    //Supprimer un cadeau
    deleteGift(index){
      this.birthdaygift.splice(index, 1)
      this.birthdaygift.sort(function (x, y) {
        let a = new Date(x.date),
          b = new Date(y.date);
        return b - a;
      });
      for (var i = 0; i < this.birthdaygift.length; i++) {
        if (this.birthdaygift[i].id != i) {
          this.birthdaygift[i].id = i;
        }
      }
      localStorage.setItem('birthdaylist', JSON.stringify(this.birthdaylist))
    },
    //R??cup??rer les informations de la personne cliqu??e
    getinformations: function (who) {
      this.firstname = this.birthdaylist[who].firstname,
        this.lastname = this.birthdaylist[who].lastname,
        this.phonenumber = this.birthdaylist[who].phonenumber,
        this.email = this.birthdaylist[who].email,
        this.date = this.birthdaylist[who].date,
        this.picturein = this.birthdaylist[who].picture
      this.birthdaygift = this.birthdaylist[who].cadeau
      this.aged = this.birthdaylist[who].yourage
      this.daysleft = this.birthdaylist[who].dateleft
      this.choice = who,
        this.dateformated = this.formatdate()
    },
    //Vider un tableau
    emptyArray: function () {
      this.birthdaydetails.pop()
    },
    //R??initialisation de toutes les valeus du formulaire
    reset: function () {
      this.firstname = '',
        this.lastname = '',
        this.date = '',
        this.picture = '',
        this.phonenumber = '',
        this.year=''
        
    },
  },
  mounted() {
    if (localStorage.getItem('birthdaylist')) {
      this.birthdaylist = JSON.parse(localStorage.getItem('birthdaylist'));
      let listtoupdate = JSON.parse(localStorage.getItem('birthdaylist'));
      for (var i = 0; i < listtoupdate.length; i++) {
        this.birthdaylist[i].dateleft = this.countdown(this.birthdaylist[i].date);
      }
      this.birthdaylist.sort(function (x, y) {
        let a = new Date(x.dateleft),
          b = new Date(y.dateleft);
        //console.log(a)
        return a - b;
      });
    }
  },
 
  watch: {
    update: function () {
      this.update = false
      localStorage.removeItem('birthdaylist');
      localStorage.setItem("birthdaylist", JSON.stringify(this.birthdaylist));
    }
    
  },
  computed: {
    filteredList() {
      if (this.whatsearch != "") {
        return this.birthdaygift.filter((gifts) => {
          return gifts.gift
            .toLowerCase()
            .includes(this.whatsearch.toLowerCase());
        });
      } else {
        return this.birthdaygift
      }
    },
    filteredListPeople() {
      if (this.whosearch != "") {
        return this.birthdaylist.filter((people) => {
          return people.firstname
            .toLowerCase()
            .includes(this.whosearch.toLowerCase());
        });
      } else {
        return this.birthdaylist
      }
    }
  },
});