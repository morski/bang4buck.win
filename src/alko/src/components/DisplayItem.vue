// DisplayItem.vue

<template>
    <div>
        <h1>Items</h1>

        <table class="table table-hover">
            <thead>
            <tr>
                <td>ID</td>
                <td>Item Name</td>
                <td>Item Price</td>
                <td>Item size</td>
                <td>B4B</td>
            </tr>
            </thead>

            <tbody>
                <tr v-for="item in items">
                    <td><a :href="'https://www.alko.fi/tuotteet/'+item.Numero" target="_blank">{{ item.Numero }}</a></td>
                    <td>{{ item.Nimi }}</td>
                    <td>{{ item.Hinta }}</td>
                    <td>{{ item.Pullokoko }} </td>
                    <td>{{ item.b4b }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import _ from 'underscore';
    export default {
        data(){
            return{
                items: []
            }
        },

        created: function()
        {
            this.fetchItems();
        },

        methods: {
            fetchItems()
            {
              let uri = 'http://localhost:8080/b4b';
              this.axios.get(uri).then((response) => {
                  this.items = _.sortBy(response.data,'b4b').reverse().filter(x => { return x.b4b != 0 && x.b4b != undefined;} );
              });
            }
        }
    }
</script>