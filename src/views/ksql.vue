<template>

  <div class="streams">
    <b-container>
        <h1 class="mt-5">Manage</h1>
        <p class="lead">View and Edit Streams and Topics</p>

        <div v-if="server_connected == false">
            <b-alert show variant="danger">We're having issues connecting to your Kafka KSQL Server, please check your Environment Variables</b-alert>
        </div>

        <b-row v-if="server_connected">
            <div class="col-sm-4">
                <item class="item" :model="data"></item>
            </div>
            <div class="col-sm-8">
                <b-row>
                    <div class="col-sm-12">
                        <b-form>
                            <b-form-group id="exampleInputGroup1"
                                            label-for="exampleInput1"
                                            >
                                <b-button-group>
                                    <b-button variant="primary" v-on:click='executeQuery'>Execute Query</b-button>
                                    <b-button variant="primary" @click='getStreams();getTopics()'>Refresh List</b-button>
                                </b-button-group>
                            </b-form-group>
                            <b-form-group id="exampleInputGroup1"
                                            label-for="exampleInput1"
                                            >
                                        <b-form-textarea id="textarea1"
                                                        v-model="query_text"
                                                        placeholder="Enter SQL Syntax here"
                                                        :rows="6"
                                                        :max-rows="6"
                                                        @keydown.native="checkEnter" >
                                        </b-form-textarea>
                            </b-form-group>
                        </b-form>
                    </div>
                    <div class="col-sm-12">
                        <h5>Results</h5>
                        <vue-json-pretty
                            :data=query_results
                        >
                        </vue-json-pretty>
                    </div>
                </b-row>
            </div>
        </b-row>
    </b-container>
  </div>
</template>

<script>
import { Servers } from '../modules/check_server_connection'
import axios from 'axios'
import item from '../components/treeview'
import VueJsonPretty from 'vue-json-pretty'

export default {
    components: {
        'item': item,
        VueJsonPretty
    },
    data () {
        return {
            show: true,
            open: false,
            server_connected: false,
            query_text: '',
            query_results: 'Results here',
            data: {
                name: 'Kafka',
                children: [
                    {
                        name: 'Topics',
                        children: []

                    },
                    {
                        name: 'Streams',
                        children: []

                    }

                ]

            }

        }
    },
    methods: {
        async getTopics () {
            this.data.children[0].children = []

            let u = this.$store.getters.getKsqlServer + '/ksql'
            let d = {
                'ksql': 'show topics;'

            }

            let r = await axios.post(u, d)

            if(r.status !== 200) {
                return false
            }

            r.data[0].topics.forEach((v) => {
                this.data.children[0].children.push({
                    'name': v.name
                })
            })
        },
        async getStreams () {
            this.data.children[1].children = []

            let u = this.$store.getters.getKsqlServer + '/ksql'
            let d = {
                'ksql': 'show streams;'

            }

            let r = await axios.post(u, d)

            if(r.status !== 200) {
                return false
            }

            r.data[0].streams.forEach((v) => {
                this.data.children[1].children.push({
                    'name': v.name
                })
            })
        },
        async executeQuery () {
            let u = this.$store.getters.getKsqlServer + '/ksql'
            let d = {
                'ksql': this.query_text

            }

            let r = await axios.post(u, d).catch((err) => { return err.response })

            this.query_results = r.data
        },
        async checkEnter (e) {
            console.log(e)
            if(e.keyCode === 13 && e.shiftKey) {
                this.executeQuery()
            }
        }
    },
    created: async function () {
        let k = this.$store.getters.getKsqlServer

        let s = new Servers()

        s.ksql_server = k

        if(await s.checkKSQLServer()) {
            this.server_connected = true

            this.getTopics()
            this.getStreams()

            return true
        }

        this.server_connected = false
    }
}
</script>
