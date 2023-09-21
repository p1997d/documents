<template>
  <div class="document-editor" id="document">
    <div style="display:flex; padding-top: 10px; justify-content: space-between; margin: 0 5px;" class="mb-3">
      <div style="display:flex; align-items: center;">
        <input type="text" name="title" id="title" placeholder="Введите название" style="width:200px;" class="form-text">
        <div id="editor-status">
          <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <span id="autosave-status"><i class="bi bi-check-lg save-success"></i></span>
        </div>
      </div>
      <div><button id="buttonClose" class="btn btn-outline-dark btn-sm" @click="buttonClose" aria-label="Close"><i class="bi bi-x"></i></button></div>
    </div>   
    <div class="document-editor__toolbar"></div>
      <div class="editor-container">
        <div class="editor"></div>
      </div>
  </div>
</template>

<script>
import { fireDb } from '~/plugins/firebase.js';

export default { 
  ssr: false, 
  middleware: 'auth',
  data() {
    return {
      status: '',
    }
  },
  asyncData ({ params, $http }) {
    return $http.$get( '/api/getDocument/' + params.documentID )
      .then( ( res ) => {
        return { doc: res };
      })
  },
  head () {
    return {
      title: `${this.doc.title}`
    }
  },
  created() {
    if ( process.browser ){
      window.addEventListener( 'beforeunload', this.saveToMongo );
    };
  },
  beforeDestroy() {
    if ( process.browser ){
      window.addEventListener( 'beforeunload', this.saveToMongo );
    };
  },
  async mounted() {
    let documentID = this.$route.params.documentID;
    let title = document.getElementById( 'title' );
    DecoupledDocumentEditor
      .create( document.querySelector( '.editor' ), {
      toolbar: {
        items: [
          'undo',
          'redo',
          'removeFormat',
          '|',
          'heading',
          '|',
          'fontFamily',
          'fontSize',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'subscript',
          'superscript',
          '|',
          'alignment',
          '|',
          'numberedList',
          'bulletedList',
          'todoList',
          '|',
          'indent',
          'outdent',
          '|',
          'findAndReplace',
          '|',
          'specialCharacters',
          'link',
          'blockQuote',
          'imageUpload',
          'mediaEmbed',
          'insertTable',
          'pageBreak'
        ]
      },
      language: 'ru',
      image: {
        toolbar: [
          'imageTextAlternative',
          'imageStyle:inline',
          'imageStyle:block',
          'imageStyle:side'
        ]
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableCellProperties',
          'tableProperties'
        ]
      },
      licenseKey: '',
      autosave: {
        save( editor ) {
          return saveData( editor.getData() );
        }
      }  
    })
    .then( editor => {
      if ( this.doc.status === "Ok" ) {
        window.editor = editor;
        displayStatus( editor );
        title.value = this.doc.title;
        editor.setData( this.doc.text );
        fireDb.ref( 'CyberPashka/document-' + documentID ).set({
          title: title.value,
          text: editor.getData(),
        });
      }
      else if ( this.doc.status === "notAccess" ) {
        document.getElementById('document').innerHTML = `      
          <div class="container">
            <h4><b>Нет доступа к файлу</b></h4>
            <a href="/" class="nuxt-link-active">На главную</a>
          </div>
        `
      }
      else if ( this.doc.status === "notFile" ){
        document.getElementById('document').innerHTML = `      
          <div class="container">
            <h4><b>Указан неверный URL или файл не существует</b></h4>
            <a href="/" class="nuxt-link-active">На главную</a>
          </div>
        `
      };
      // Set a custom container for the toolbar.
      document.querySelector( '.document-editor__toolbar' ).appendChild( editor.ui.view.toolbar.element );
      document.querySelector( '.ck-toolbar' ).classList.add( 'ck-reset_all' );
    } )
    .catch( error => {
      console.error( 'Oops, something went wrong!' );
      console.error( 'Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:' );
      console.warn( 'Build id: geex579409mc-dktwshp7jcpk' );
      console.error( error );
    });
    document.querySelector( '#title' ).oninput = function( editor ) {
      saveData( document.querySelector( '.editor' ).innerHTML );
    };

    // Save the data to a fake HTTP server (emulated here with a setTimeout()).
    function saveData( data ) {
      return new Promise( resolve => {
        setTimeout( () => {
            fireDb.ref( 'CyberPashka/document-' + documentID ).set({
              title: title.value,
              text: data,
            });
            resolve();
        }, 500 );        
      }).then( () => {
        $nuxt.$route.matched[0].instances.default.saveToMongo();
      });
    }
    // Update the "Status: Saving..." info.
    function displayStatus( editor ) {
        const pendingActions = editor.plugins.get( 'PendingActions' );
        const statusIndicator = document.querySelector( '#editor-status' );

        pendingActions.on( 'change:hasAny', ( evt, propertyName, newValue ) => {
            if ( newValue ) {
                statusIndicator.classList.add( 'busy' );
                statusIndicator.setAttribute( 'style', 'opacity:1' );
            } else {
                statusIndicator.classList.remove( 'busy' );
                statusIndicator.setAttribute( 'style', 'opacity:1' );
                setTimeout( () => { statusIndicator.setAttribute( 'style', 'opacity:0' ) }, 2000);
            };
        });
    }
  },
  methods: {
    async saveToMongo(){      
      this.status = await this.$http.$get( '/api/saveDocument/' + this.$route.params.documentID );
    },
    async buttonClose(){
        this.$nuxt.$loading.start()
        this.status = await this.$http.$get( '/api/saveDocument/' + this.$route.params.documentID )
        this.$router.push( '/' );
    }
  }
}
</script>
