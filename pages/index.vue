<template>
  <div class="main">
    <div class="head">
      <div style="display:flex">
        <button type="button" @click="newDocument" class="btn btn-primary" style="margin: 0 10px;"><i class="bi bi-plus"></i> Новый документ</button>
      </div>
      <div>
        {{this.$auth.user.username}}
        <button v-on:click="userLogout" class="btn btn-primary" style="margin: 0 10px;">Выйти</button>
      </div>
    </div>
    <div id="documentList">
      <div class="file" v-for="item in list" :key="item">
        <p style="margin: auto 0;"><b><i class="bi bi-file-earmark-word"></i>{{item.title}}</b></p>
        <div style="margin: auto 0;">
          <button @click="$router.push( '/' + item.documentID.split( '-' )[0] + '/'+item.documentID.split( '-' )[1])" class="btn btn-primary" style="margin: 0 10px;">Открыть</button>
          <button @click="removeDocument" :id="item.documentID" class="btn btn-primary" style="margin: 0 10px;">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {  
  middleware: 'auth',
  data() {
    return {
      list: [],
      file: ''
    }
  },
  async mounted() {
    await this.$http.$get( '/api/list' ).then( result => {
      let list = [];
      result.forEach( function ( item, i ) {
        list.push( { title: item.title, documentID: item.id } );
      });
      this.list = list;
    });
  },
  methods: {
    async newDocument() {
      this.$nuxt.$loading.start();
      this.status = await this.$http.$get( '/api/newDocument/' );
      let list = [];
      const results = await this.$http.$get( '/api/list' );
      results.forEach( function ( item, i ) {
        list.push( { title: item.title, documentID: item.id } );
      });
      this.list = list;      
      this.$nuxt.$loading.finish()
    },
    async removeDocument( event ) {      
      let documentID = event.target.id;
      this.$nuxt.$loading.start();
      this.status = await this.$http.$get( '/api/removeDocument/' + documentID );
      let list = [];
      const results = await this.$http.$get( '/api/list' );
      results.forEach( function ( item, i ) {
        list.push( { title: item.title, documentID: item.id } );
      });
      this.list = list;      
      this.$nuxt.$loading.finish();
    },
    async userLogout() {
      try {
        let response = await this.$auth.logout().then( () => {
          this.$router.push( '/login' );
        });
      } catch ( err ) {
        console.log( err );
      }
    }
  }
}
</script>
