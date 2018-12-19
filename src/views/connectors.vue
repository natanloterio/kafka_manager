<template>
  <div class="connectors">
    <b-container>
        <h1 class="mt-5">Connectors and Sinks</h1>

        <div v-if="server_connected == false">
            <b-alert show variant="danger">
                We're having issues connecting to your Kafka Connect Server, please check your Environment Variables<br>
            </b-alert>
        </div>

        <b-row v-if="server_connected">
            <b-container>
                <b-row>
                    <b-col>
                        <strong>Connectors</strong>
                            <b-list-group >
                                <b-list-group-item button v-for="c in connectors" v-bind:key=c.id>
                                    {{c.name}}
                                    <b-button size="sm" @click.stop="deleteConnector(c.name)" class="mr-1 float-right">
                                        Delete
                                    </b-button>
                                </b-list-group-item>
                            </b-list-group>
                    </b-col>
                    <b-col v-if="sinks.length > 0">
                        <strong>Sinks</strong>
                            <b-list-group >
                                <b-list-group-item button v-for="s in sinks" v-bind:key=s.id>
                                    {{s.name}}
                                    <b-button size="sm" @click.stop="deleteConnector(s.name)" class="mr-1 float-right">
                                        Delete
                                    </b-button>
                                </b-list-group-item>
                            </b-list-group>
                    </b-col>
                </b-row>
            </b-container>
        </b-row>
        <br>
        <b-row v-if="server_connected">
            <div class="col-sm-12">
                <b-form @submit="addConnector" @reset="onResetConnector" v-if="show">
                    <b-form-group id="exampleInputGroup1"
                                    label-for="exampleInput1"
                                    description="Upload a JSON configuration script here">
                        <b-form-textarea id="exampleInput1"
                                    type="text"
                                    v-model="form.connector_config"
                                    required
                                    :rows="3"
                                    placeholder="Enter config here">
                        </b-form-textarea>
                    </b-form-group>
                    <b-button-group>
                        <b-button type="submit" variant="primary">Add Connector</b-button>
                        <b-button type="reset" variant="danger">Clear</b-button>
                    </b-button-group>
                </b-form>
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
            form: {
                connector_config: ''
            },
            connectors: [],
            sinks: [],
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

            r.data.sort((a, b) => {
                if(a < b) { return -1 }
                if(a > b) { return 1 }
                return 0
            })

            r.data.forEach((v, i) => {
                let c = {
                    'id': i,
                    'sortable': true,
                    'name': v

                }

                // determine if connector or sink based off name
                if(v.indexOf('sink') > -1) {
                    this.sinks.push(c)
                } else {
                    this.connectors.push(c)
                }
            })
        },
        async deleteConnector (name) {
            let self = this

            this.api_response = ''

            let u = this.$store.getters.getConnectorServer + '/connectors/' + name

            try {
                let r = await axios.delete(u)

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
    async created () {
        let c = this.$store.getters.getConnectorServer
        let r = this.$store.getters.getKafkaServer

        let s = new Servers(c, r)

        if(await s.checkConnectServer()) {
            this.server_connected = true

            this.loadConnectors()
            return true
        }

        this.server_connected = false
    }
}
</script>
