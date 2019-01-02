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
                                <b-button-group>
                                    <b-button variant="primary" @click='createTopic'>Create Topic</b-button>
                                    <b-button variant="primary" @click='getStreams();getTopics()'>Refresh List</b-button>
                                </b-button-group>
                <item class="item" :model="data"></item>
            </div>
            <div class="col-sm-8" v-if="show_sql">
                <b-row>
                    <div class="col-sm-12">
                        <b-form>
                            <b-form-group id="exampleInputGroup1"
                                            label-for="exampleInput1"
                                            >
                                <b-button-group>
                                    <b-button variant="primary" v-on:click='executeQuery'>Execute Query</b-button>
                                    <b-button variant="primary" @click='clearResults'>Clear Results</b-button>
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
            <div class="col-sm-8" v-if="show_create_topic">
    <b-alert variant="danger"
             dismissible
             :show="create_topic_form.show_error"
             @dismissed="create_topic_form.show_error=false">
      {{ create_topic_form.response }}
    </b-alert>
    <b-alert variant="success"
             dismissible
             :show="create_topic_form.show_success"
             @dismissed="create_topic_form.show_success=false">
      {{ create_topic_form.response }}
    </b-alert>
                <b-form >
                    <b-form-group id="exampleInputGroup1"
                                    label="Topic Name:"
                                    label-for="exampleInput1"
                                    description=" ">
                        <b-form-input id="exampleInput1"
                                    type="text"
                                    required
                                    v-model='create_topic_form.topic'
                                    placeholder="Enter a name for your Topic">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group id="exampleInputGroup1"
                                    label="Partitions:"
                                    label-for="exampleInput1"
                                    description=" ">
                        <b-form-input id="exampleInput1"
                                    type="number"
                                    required
                                    v-model="create_topic_form.partitions"
                                    placeholder="1">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group id="exampleInputGroup1"
                                    label="Replication Factor:"
                                    label-for="exampleInput1"
                                    description=" ">
                        <b-form-input id="exampleInput1"
                                    type="number"
                                    required
                                    v-model="create_topic_form.replicationFactor"
                                    placeholder="1">
                        </b-form-input>
                    </b-form-group>

                    <b-button-group>
                        <b-button type="submit" variant="primary" @click='createTopicSubmit'>Create Topic</b-button>
                        <b-button type="reset" variant="danger" @click='cancelCreateTopic'>Cancel</b-button>
                    </b-button-group>
                </b-form>
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
            show_sql: true,
            show_create_topic: false,
            query_text: '',
            query_results: 'Enter a Query and hit Ctrl+Enter to Execute',
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

            },
            create_topic_form: {
                topic: '',
                partitions: 1,
                replicationFactor: 1,
                show_error: false,
                response: '',
                show_success: false
            },
            kafkaClient: {}

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
                    'name': v.name,
                    'children': [
                        { name: 'View Data' },
                        { name: 'Drop Topic' }
                    ]
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

            this.query_results = 'loading...'

            let r = await axios.post(u, d).catch((err) => { return err.response })

            this.query_results = r.data
        },
        async checkEnter (e) {
            if(e.keyCode === 13 && e.ctrlKey) {
                this.executeQuery()
            }
        },
        async clearResults () {
            this.query_results = 'Enter a Query and hit Ctrl+Enter to Execute'
        },
        async createTopic () {
            this.show_create_topic = true
            this.show_sql = false
        },
        async createTopicSubmit () {
            let a = this.$store.getters.getApiServer + '/topic'

            this.create_topic_form.show_error = false
            this.create_topic_form.show_success = false

            let b = {
                'topic': this.create_topic_form.topic,
                'partitions': this.create_topic_form.partitions,
                'replication': this.create_topic_form.replicationFactor
            }

            let r = await axios.post(a, b).catch((err) => { return err.response })

            if(r.data.length > 0) {
                this.create_topic_form.show_error = true

                this.create_topic_form.response = r.data[0].error

                return false
            }

            this.getTopics()
            this.getStreams()

            this.create_topic_form.show_success = true
            this.create_topic_form.response = `${this.create_topic_form.topic} created successfully`

            return true
        },
        async cancelCreateTopic () {
            this.show_create_topic = false
            this.show_sql = true
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
