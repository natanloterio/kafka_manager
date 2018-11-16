<template>

  <div class="topics">
    <!-- template for the modal component -->
    <script type="text/x-template" id="modal-template">
    <transition name="modal">
        <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">

            <div class="modal-header">
                <slot name="header">
                default header
                </slot>
            </div>

            <div class="modal-body">
                <slot name="body">
                default body
                </slot>
            </div>

            <div class="modal-footer">
                <slot name="footer">
                default footer
                <button class="modal-default-button" @click="$emit('close')">
                    OK
                </button>
                </slot>
            </div>
            </div>
        </div>
        </div>
    </transition>
    </script>
    <b-container>
        <h1 class="mt-5">Topics</h1>
        <p class="lead">View and Edit your Topics here</p>

        <b-row>
            <h4 class="mt-5">Topics</h4>
            <div class="col-sm-12">
                <b-button size="md" variant="primary" @click='loadTopics()'>
                    Refresh Topics
                </b-button>

                <b-table striped hover :items="topics" :fields="fields">
                    <template slot="actions" slot-scope="row">
                        <b-button size="sm" @click.stop="viewTopicInfo(row.item, row.index, $event.target)" class="mr-1">
                            Info
                        </b-button>
                        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                        <b-button size="sm" @click.stop="deleteIndex(row.item, row.index, $event.target)" class="mr-1">
                            Delete
                        </b-button>

                    </template>
                </b-table>
            </div>
        </b-row>

        <b-row>
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
    <b-modal ref="topic_info_modal" hide-footer :title=modal.title size="lg">
      <div class="d-block">
        <b-tabs>
        <b-tab title="Details" active>
            <br>Some details about this topic here
        </b-tab>
        <b-tab title="Configuration" >
            <br>
            <vue-json-pretty
                :path="'res'"
                :data=modal.config
            >
            </vue-json-pretty>
        </b-tab>
        <b-tab title="Partitions">
            <br>
            <vue-json-pretty
                :path="'res'"
                :data=modal.partitions
            >
            </vue-json-pretty>
        </b-tab>
        </b-tabs>

      </div>
    </b-modal>

  </div>

</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
const axios = require('axios')

export default {
    components: {
        VueJsonPretty
    },
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
            topics: [],
            show: true,
            api_response: 'Response will go here',
            modal: {
                title: '',
                config: [],
                partitions: []

            }
        }
    },
    methods: {
        async loadTopics () {
            this.topics = []

            this.api_response = ''

            let u = this.$store.getters.getKafkaServer + '/topics'
            let r = await axios.get(u)

            this.api_response = r

            r.data.forEach((v, i) => {
                this.topics.push({
                    'id': i,
                    'sortable': true,
                    'name': v

                })
            })
        },
        async deleteTopic (item, index, target) {
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
        async viewTopicInfo (item, index, target) {
            let self = this

            let u = this.$store.getters.getKafkaServer + '/topics/' + item.name

            try {
                let r = await axios.get(u)

                self.modal.title = item.name
                self.modal.config = r.data.configs
                self.modal.partitions = r.data.partitions
                self.$refs.topic_info_modal.show()
            } catch (err) {
            }
        }
    }
}
</script>
