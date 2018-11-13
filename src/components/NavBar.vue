<template>
    <b-navbar toggleable="md" type="dark" variant="info">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand to="/">M&A Kafka Manager</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">
            <!-- Right aligned nav items -->
            Server: {{current_server}}
            <b-navbar-nav class="ml-auto">
                <b-navbar-nav>
                    <b-nav-item to="/">Home</b-nav-item>
                    <b-nav-item to="/server_setup">Server Setup</b-nav-item>
                    <b-nav-item to="/connectors">Connectors</b-nav-item>
                </b-navbar-nav>
            </b-navbar-nav>

        </b-collapse>
    </b-navbar>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import check_server from '../modules/check_server_connection'

export default {
    name: 'NavBar',
    computed: {
        current_server(){
            return this.$store.getters.getServer;
        },
        connection_status_icon(){
            if(this.current_server === null) {
                return;

            }

            
        }
    }
}
</script>