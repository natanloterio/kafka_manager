<template>
  <div class="connectors">
    <b-container>
        <h1 class="mt-5">Connectors</h1>
        <p class="lead">View and Edit your connectors here</p>

        <b-row>
            <h4 class="mt-5">View and Delete Connectors</h4>
            <div class="col-sm-12">
                <b-button size="md" variant="primary" @click='loadConnectors()'>
                    Refresh Connectors
                </b-button>

                <b-table striped hover :items="connectors" :fields="fields">
                    <template slot="actions" slot-scope="row">
                        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                        <b-button size="sm" @click.stop="info(row.item, row.index, $event.target)" class="mr-1">
                        Delete
                        </b-button>
                    </template>
                </b-table>
            </div>
        </b-row>

        <b-row>
            <h4 class="mt-5">Upload new Connector Config</h4>
            <div class="col-sm-12">
                sf
            </div>
        </b-row>

    </b-container>
  </div>
</template>



<script>
const axios = require('axios');
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
        fields: [{
            "key": 'id',
            "label": 'ID',
            "sortable": true
        }, {
            "key": "name",
            "label": "Connector Name",
            "sortable": true
            
        }, {
            "key": "actions",
            "label": "Actions"
        }],
        connectors: []
    }
  },
  methods: {
    async loadConnectors() {
        this.connectors = [];

        let r = await axios.get('http://mihl-web03.report.dmz:8083/connectors');

        r.data.forEach((v, i) => {
            this.connectors.push({
                "id": i,
                "sortable": true,
                "name": v

            });

        });

    }

  }
}
</script>