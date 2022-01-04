const content = new Vue({
    el: "#app",
    data: {
      title: "Anniversaires",
      searchplaceholder: "Rechercher une personne",
      firstname: '',
      lastname: '',
      date: '',
      dateformated:'',
      picture: '',
      choice: '',
      years: [],
      aged:'',
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
      phonenumber:'',
      email:'',
    },

    methods: {

      next: function (base) {
        return base + 1
      },
      countdown: function (day) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

    
       

        const thedate = day.split('-');
       
        var actu = new Date();
        console.log(actu)
        var annee = actu.getFullYear();
        console.log(annee)
        var mois = thedate[1];
        console.log(mois)
        var anni = new Date(thedate[2] + "-" + monthNames[mois - 1] +"-"+ annee);
        var intervalle = anni.getTime() - actu.getTime();
        intervalle = Math.floor(intervalle / (1000 * 60 * 60 * 24));
        //console.log(intervalle)
        //alert(parseInt(intervalle))
        if((intervalle) == -1){
            numberleft = 0
        } else {
        if (intervalle < -1) {
          numberleft = intervalle + 366;
        }else 
          numberleft = intervalle + 1;
        }
        
        return numberleft;
      },
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
      formatdate: function(){
        const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Spetembre", "Octobre", "Novembre", "Décembre"
      ];
        const thedate = this.date.split('-');
        var an = thedate[0];
        var mois = thedate[1]
        var day = thedate[2]
        return day+" "+ monthNames[mois - 1]+" "+an
      },
      onFileSelected(event) {
        let reader = new FileReader();
        reader.onload = function () {
          localStorage.setItem("images", JSON.stringify(reader.result));
        };
        if (event.target.files[0]) {
          reader.readAsDataURL(event.target.files[0]);
          localStorage.removeItem("images");
        }
      },
      dategenerator: function () {
        for (let index = 2021; index <= 2040; index++) {
          this.years.push({
            date: index,
          })
        }
      },
      addagift: function () {
        this.showaddformgift = false,
          this.update = true;
        this.birthdaygift.push({
            date: this.year,
            gift: this.gift
          }),
          this.year = '',
          this.gift = ''
        this.birthdaylist[this.choice].push(this.birthdaygift)
      },
      generateid: function () {
        length = this.birthdaylist.length
        return length
      },
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
      deleteMember() {
        who = this.choice
        this.birthdaylist.splice(who, 1)
        this.birthdaylist.sort(function (x, y) {
          let a = new Date(x.date),
            b = new Date(y.date);
          return a - b;
        });
        for (var i = 0; i < this.birthdaylist.length; i++) {
          if (this.birthdaylist[i].id != i) {
            this.birthdaylist[i].id = i;
          }
        }
        localStorage.setItem('birthdaylist', JSON.stringify(this.birthdaylist))
      },

      getinformations: function (who) {
        this.firstname = this.birthdaylist[who].firstname,
        this.lastname = this.birthdaylist[who].lastname,
        this.phonenumber = this.birthdaylist[who].phonenumber,
        this.email = this.birthdaylist[who].email,
        this.date = this.birthdaylist[who].date,
        this.picture = this.birthdaylist[who].picture
        this.birthdaygift = this.birthdaylist[who].cadeau
        this.aged = this.birthdaylist[who].yourage
        this.daysleft = this.birthdaylist[who].dateleft
        this.choice = who,
        this.dateformated = this.formatdate()
      },
      emptyArray: function () {
        this.birthdaydetails.pop()
      },
      reset: function () {
        this.firstname = '',
          this.lastname = '',
          this.date = '',
          this.picture = ''
      },
    },
    mounted() {
      if (localStorage.getItem('birthdaylist'))
        this.birthdaylist = JSON.parse(localStorage.getItem('birthdaylist'));
      this.dategenerator()
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
    create() {
      this.dategenerator(),
        this.countdown()
    },
  });