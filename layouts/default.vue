<template>
  <div id="wrapper" :class="theme">
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Footer from '~/components/Footer'
import Header from '~/components/Header'

export default {
  components: {
    Footer,
    Header,
  },
  computed: {
    ...mapGetters({
      theme: 'common/getTheme',
    }),
  },
}
</script>
