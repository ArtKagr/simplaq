<template>
  <div class="loyalty-setup">
    <span class="loyalty-setup-title">Setup loyalty program</span>
    <div class="loyalty-setup-container">
      <div
        v-for="block in menu"
        :key="block.key"
        class="loyalty-setup-container-block"
      >
        <div class="loyalty-setup-container-block-title_block">
          <div class="loyalty-setup-container-block-line-short" />
          <span
            class="loyalty-setup-container-block-title"
            v-text="block.title"
          />
          <div class="loyalty-setup-container-block-line-long" />
        </div>
        <div class="loyalty-setup-container-block-pages">
          <div
            v-for="page in block.pages"
            :key="page.key"
            class="loyalty-setup-container-block-pages-page"
            @click="setCurrentSetupPage(page.link)"
          >
            <span
              class="loyalty-setup-container-block-pages-page-title"
              v-text="page.title"
            />
            <div>
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 0L0.589996 1.41L5.17 6L0.589996 10.59L2 12L8 6L2 0Z" fill="#7B8698"/>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoyaltySetup',
  data () {
    return {
      menu: [
        {
          title: 'Points',
          pages: [
            { title: 'Value of points', key: 'value_of_points', link: 'value-points' },
            { title: 'Points expiration', key: 'points_expiration', link: 'points-expiration' }
          ],
          key: 'points'
        },
        {
          title: 'Receipts',
          pages: [
            { title: 'Restrict scanning', key: 'restrict_scanning', link: 'restrict-scanning' },
            { title: 'Approval rules', key: 'approval_rules', link: 'approval-rules' }
          ],
          key: ' receipts'
        },
        {
          title: 'Rewards',
          pages: [
            { title: 'Limit rewards', key: 'limit_rewards', link: 'limit-rewards' }
          ],
          key: 'rewards'
        }
      ]
    }
  },
  methods: {
    setCurrentSetupPage (link) {
      this.$router.push(`/loyalty/setup/${link}`)
    }
  }
}
</script>
