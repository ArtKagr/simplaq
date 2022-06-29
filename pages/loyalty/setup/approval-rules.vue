<template>
  <div class="loyalty-setup-page">
    <loyalty-setup-head title="Approval rules" @handler="saveData" />
    <div class="loyalty-setup-page-container">
      <b-table
        :fields="fields"
        :items="rules"
        head-variant="gray-200"
        class="smq-table"
      >
        <template v-slot:cell(title)="row">
          <span class="smq-table-text -bold" v-text="row.item.title"/>
        </template>
        <template v-slot:cell(approve)="row">
          <div class="d-flex align-items-center">
            <smq-icon-radiobox-marked v-if="row.item.value === 'approve'" />
            <smq-icon-radiobox-blank v-else @click.native="setValue(row.index, 'approve')" />
          </div>
        </template>
        <template v-slot:cell(manual_review)="row">
          <smq-icon-radiobox-marked v-if="row.item.value === 'manual_review'" />
          <smq-icon-radiobox-blank v-else @click.native="setValue(row.index, 'manual_review')" />
        </template>
        <template v-slot:cell(decline)="row">
          <smq-icon-radiobox-marked v-if="row.item.value === 'decline'" />
          <smq-icon-radiobox-blank v-else @click.native="setValue(row.index, 'decline')" />
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import LoyaltySetupHead from '~/components/loyalty/setup/setupHead'
import SmqIconRadioboxMarked from '~/components/icons/smq-icon-radiobox-marked'
import SmqIconRadioboxBlank from '~/components/icons/smq-icon-radiobox-blank'
export default {
  name: 'LoyaltySetupApprovalRules',
  components: { SmqIconRadioboxBlank, SmqIconRadioboxMarked, LoyaltySetupHead },
  data () {
    return {
      fields: [
        {
          key: 'title',
          label: ''
        },
        {
          key: 'approve',
          label: 'Approve'
        },
        {
          key: 'manual_review',
          label: 'Manual review'
        },
        {
          key: 'decline',
          label: 'Decline'
        }
      ],
      rules: [
        { title: 'OCR fail', value: 'decline' },
        { title: 'Vendor is not tenant', value: 'decline' },
        { title: 'Value > 10 points', value: 'decline' },
        { title: 'Value > 100 points', value: 'decline' },
        { title: 'Value > 1000 points', value: 'decline' },
        { title: 'Value > 10.000 points', value: 'decline' }
      ]
    }
  },
  methods: {
    saveData () {

    },
    setValue (index, value) {
      this.rules[index].value = value
    }
  }
}
</script>
