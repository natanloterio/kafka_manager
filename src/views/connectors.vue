<template>
  <div class="connectors">
    <b-container>
        <h1 class="mt-5">Connectors</h1>
        <p class="lead">View and Edit your connectors here</p>

        <div v-if="server_connected == false">
            <b-alert show variant="danger">
                We're having issues connecting to your Kafka Connect Server, please check your Environment Variables<br>
            </b-alert>
        </div>

        <b-row v-if="server_connected">
            <h4 class="mt-5">View and Delete Connectors</h4>
            <div class="col-sm-12">
                <b-button size="md" variant="primary" @click='loadConnectors()'>
                    Refresh Connectors
                </b-button>
                <b-table striped hover :items="connectors" :fields="fields">
                    <template slot="actions" slot-scope="row">
                        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                        <b-button size="sm" @click.stop="deleteConnector(row.item, row.index, $event.target)" class="mr-1">
                            Delete
                        </b-button>
                    </template>
                </b-table>
            </div>
        </b-row>

        <b-row v-if="server_connected">
            <h4 class="mt-5">Upload new Connector Config</h4>
            <div class="col-sm-12">
                <b-form @submit="addConnector" @reset="onResetConnector" v-if="show">
                <b-form-group id="exampleInputGroup1"
                                label="JSON Connector Config:"
                                label-for="exampleInput1"
                                description="sdf">
                    <b-form-textarea id="exampleInput1"
                                type="text"
                                v-model="form.connector_config"
                                required
                                :rows="3"

                                placeholder="Enter config here">
                    </b-form-textarea>
                </b-form-group>
                <b-button type="submit" variant="primary">Add Connector</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
                </b-form>
            </div>
        </b-row>

        <b-row v-if="server_connected">
            <h4 class="mt-5">API Response</h4>
            <div class="col-sm-12">
                <div class="card bg-faded">
                    <div class="card-block">
                        {{api_response}}
                    </div>
                </div>
            </div>
        </b-row>

    </b-container>
  </div>
</template>

<script>
import Servers from '../modules/check_server_connection'

const axios = require('axios')

export default {
    data () {
        return {
            fields: [{
                'key': 'id',
                'label': 'ID',
                'sortable': true
            }, {
                'key': 'name',
                'label': 'Connector Name',
                'sortable': true

            }, {
                'key': 'actions',
                'label': 'Actions'
            }],
            form: {
                connector_config: ''
            },
            connectors: [],
            show: true,
            server_connected: false,
            api_response: 'Response will go here'
        }
    },
    methods: {
        async loadConnectors () {
            this.connectors = []

            this.api_response = ''

            let u = this.$store.getters.getConnectorServer + '/connectors'
            let r = await axios.get(u)

            this.api_response = r

            r.data.forEach((v, i) => {
                this.connectors.push({
                    'id': i,
                    'sortable': true,
                    'name': v

                })
            })
        },
        async deleteConnector (item, index, target) {
            let self = this

            this.api_response = ''

            let u = this.$store.getters.getConnectorServer + '/connectors/' + item.name

            try {
                let r = await axios.delete(u, this.form.connector_config)

                self.api_response = r
            } catch (err) {
                self.api_response = err
            }

            self.loadConnectors()
        },
        async addConnector (evt) {
            let self = this

            this.api_response = ''

            let u = this.$store.getters.getConnectorServer + '/connectors'

            try {
                let r = await axios.post(u, this.form.connector_config, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                self.api_response = r
            } catch (err) {
                self.api_response = err
            }

            this.loadConnectors()
        },
        onResetConnector (evt) {
            evt.preventDefault()
            /* Reset our form values */
            this.form.connector_config = ''
            this.api_response = ''

            /* Trick to reset/clear native browser form validation state */
            this.show = false
            this.$nextTick(() => { this.show = true })
        }
    },
    async beforeMount () {
        console.log('yo')

        let c = this.$store.getters.getConnectorServer
        let r = this.$store.getters.getKafkaServer

        let s = new Servers(c, r)

        if(await s.checkConnectServer()) {
            this.server_connected = true

            return true
        }

        this.server_connected = false
    }
}
</script>
