<template>

  <div class="streams">
    <b-container>
        <h1 class="mt-5">Manage</h1>
        <p class="lead">View and Edit Streams and Topics</p>

        <div v-if="server_connected == false">
            <b-alert show variant="danger">We're having issues connecting to your Kafka KSQL Server, please check your Environment Variables</b-alert>
        </div>

        <b-row v-if="server_connected">
            <div class="col-sm-12 col-md-6 col-lg-4">
                <b-button-toolbar key-nav  aria-label="Toolbar with button groups">
                    <b-button-group class="mx-1">
                        <b-btn variant="primary" @click='createTopic' size="sm"><font-awesome-icon icon="folder-plus" /> Create Topic</b-btn>
                        <b-btn variant="primary" @click='getStreams();getTopics()' size="sm"><font-awesome-icon icon="sync" /> Refresh List</b-btn>
                        <b-btn variant="primary" @click='showSql' size="sm">SQL Editor</b-btn>
                    </b-button-group>
                </b-button-toolbar>
                <item class="item" :model="data" ></item>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-8" v-if="show_sql">
                <b-row>
                    <div class="col-sm-12">
                        <div>
                            <b-button-toolbar key-nav  aria-label="Toolbar with button groups">
                                <b-button-group class="mx-1">
                                    <b-btn variant="primary" v-on:click='executeksql' size="sm">Execute Query</b-btn>
                                    <b-btn variant="primary" @click='clearResults' size="sm">Clear Results</b-btn>
                                </b-button-group>
                            </b-button-toolbar>
                        </div>
                        <b-form>
                            <b-form-group id="exampleInputGroup1"
                                            label-for="exampleInput1"
                                            >

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
                        <b-button type="submit" variant="primary" @click='createTopicSubmit' size="sm">Create Topic</b-button>
                        <b-button type="reset" variant="danger" @click='cancelCreateTopic' size="sm">Cancel</b-button>
                    </b-button-group>
                </b-form>
            </div>
            <div class="col-sm-8" v-if="show_topic_data">
                    <div class="col-sm-12">
                        <h5>Results</h5>
                        <vue-json-pretty
                            :data=query_results
                        >
                        </vue-json-pretty>
                    </div>
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
        item,
        VueJsonPretty
    },
    data () {
        return {
            show: true,
            open: false,
            server_connected: false,
            show_sql: true,
            show_create_topic: false,
            show_topic_data: false,
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
            let self = this
            this.data.children[0].children = []

            let a = this.$store.getters.getApiServer + '/topic'
            let r = await axios.get(a)

            if(r.status !== 200) {
                return false
            }

            r.data.forEach((v) => {
                this.data.children[0].children.push({
                    'name': v,
                    'children': [
                        { name: 'View Data', topic: v, getData: (v) => { self.getTopicData(v) } },
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
        async executeksql () {
            let u = this.$store.getters.getKsqlServer + '/ksql'
            let d = {
                'ksql': this.query_text

            }

            this.query_results = 'loading...'

            let r = await axios.post(u, d).catch((err) => { return err.response })

            // check if it requires /query endpoint as a fallback
            if(r.data.error_code === 40002) {
                this.query_results = await this.executeQuery()
                return
            }

            this.query_results = r.data
        },
        async executeQuery () {
            let u = this.$store.getters.getKsqlServer + '/query'
            let d = {
                'ksql': this.query_text

            }

            this.query_results = 'loading...'

            let r = await axios.post(u, d).catch((err) => { return err.response })

            // check if it requires /query endpoint as a fallback
            return r.data
        },
        async checkEnter (e) {
            if(e.keyCode === 13 && e.ctrlKey) {
                this.executeksql()
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
        },
        async getTopicData (topic) {
            this.show_create_topic = false
            this.show_sql = false
            this.show_topic_data = true

            let a = this.$store.getters.getApiServer + '/topicdata/' + topic
            this.query_results = 'loading...'

            let r = await axios.get(a, { 'responseType': 'stream' }).catch((err) => { return err.response })

            this.query_results = r.data
        },
        showSql () {
            this.show_create_topic = false
            this.show_sql = true
            this.show_topic_data = false
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
