<template>
    <b-navbar toggleable="md" type="dark" variant="info">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand to="/">Centrix Kafka Manager</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav class="ml-auto">
                <b-navbar-nav>
                    <b-nav-item to="/">Home</b-nav-item>
                    <b-nav-item to="/manage">Manage</b-nav-item>
                    <b-nav-item to="/connectors">Connectors</b-nav-item>
                </b-navbar-nav>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>

</template>

<script>
export default {
    name: 'NavBar',
    computed: {
        current_server () {
            return this.$store.getters.getConnectorServer
        }
    }
}
</script>
