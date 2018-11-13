<template>
  <div class="server_setup">
    <b-container>
        <h1 class="mt-5">Server Setup</h1>
        <p class="lead">Adding your server url here will cause it to persist across this app for this session only</p>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="connect_url" 
                    label="Kafka Connect URL:"
                    label-for="exampleInput1"
                    description="This is the URL that points to a Kafka Connect Instance.. by default it will be http://hostname:8083">
        <b-form-input id="exampleInput1"
                      type="text"
                      v-model="form.url"
                      required
                      placeholder="Enter url">
        </b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Connect</b-button>
      <b-button type="reset" variant="danger">Reset and Clear Server</b-button>
    </b-form>

    </b-container>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      form: {
        url: ''
      },
      show: true
    }
  },
  methods: {
    ...mapActions(['add_server']),
    onSubmit (evt) {
        evt.preventDefault();

        this.$store.dispatch('add_server', {
            url: this.form.url
        
        });

    },
    onReset (evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.form.url = '';

    this.$store.dispatch('remove_server');

      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => { this.show = true });
    }
  }
}
</script>