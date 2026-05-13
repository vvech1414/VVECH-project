// Analytics dispatcher. Typed event union covers the consolidated list from
// the spec § "Suggested analytics events". Prototype pipes events to console;
// swap pipeFn for a real client (Amplitude / Segment / etc.) when wiring up.

import type { AckMechanism, ConsentBundle, ConsentId } from '../store/types'

export type AnalyticsEvent =
  // Welcome
  | { name: 'welcome_viewed' }
  | { name: 'usp_in_view'; uspId: 'partner' | 'all_in_one' | 'prepare' | 'access_control' }
  | { name: 'welcome_cta_tapped'; dwellMs: number }
  // Account
  | { name: 'account_viewed' }
  | { name: 'account_field_blurred'; field: string; valid: boolean }
  | { name: 'account_submitted' }
  | { name: 'account_validation_error'; fields: string[] }
  // Access grant
  | { name: 'access_grant_viewed' }
  | { name: 'access_grant_confirm_checked' }
  | { name: 'access_grant_signed'; esignId: string } // synthesised — replaces esign_otp_*
  | { name: 'access_granted'; grantId: string; esignId: string }
  // Consents
  | { name: 'consents_viewed' }
  | { name: 'consent_block_tapped'; consentId: ConsentId }
  | { name: 'consent_modal_scrolled_to_end'; consentId: ConsentId }
  | {
      name: 'consent_acknowledged'
      consentId: ConsentId
      versionId: string
      ackMechanism: AckMechanism
    }
  | {
      name: 'consent_opt_in_toggled'
      consentId: ConsentId
      channels: string[]
    }
  | { name: 'consents_submitted'; bundle: ConsentBundle }
  // Transition
  | { name: 'vasily_onboarding_viewed' }
  | { name: 'vasily_onboarding_completed'; dwellMs: number }
  | { name: 'transition_shown' }
  | { name: 'transition_completed'; durationMs: number }
  | { name: 'transition_error'; errorCode: string }
  // Main
  | { name: 'prep_home_viewed' }
  // Access lifecycle (post-onboarding)
  | { name: 'access_revoked'; grantId: string }
  | { name: 'access_extended'; grantId: string; newExpiresAt: string }
  // Admin surface
  | { name: 'admin_kpi_viewed' }
  | {
      name: 'admin_kpi_card_tapped'
      kpiId: 'onboarded' | 'prepRate' | 'ocrRate'
    }
  | {
      name: 'admin_trend_viewed'
      kpiId: 'onboarded' | 'prepRate' | 'ocrRate'
    }
  | {
      name: 'admin_trend_point_inspected'
      kpiId: 'onboarded' | 'prepRate' | 'ocrRate'
      date: string
    }
  | {
      name: 'admin_drilldown_placeholder_viewed'
      selectedKpi?: 'onboarded' | 'prepRate' | 'ocrRate'
    }
  | { name: 'admin_access_by_department_viewed'; totalDepartments: number }
  | { name: 'admin_incidents_viewed'; totalCount: number }
  | { name: 'admin_incident_row_focused'; type: 'revoked' | 'expired' }
  | { name: 'admin_incident_seen'; type: 'revoked' | 'expired' }
  | {
      name: 'admin_compliance_summary_viewed'
      complianceState: 'green' | 'amber' | 'red'
    }
  | {
      name: 'admin_compliance_check_focused'
      checkId: 'n3' | 'n4' | 'n5' | 'n7'
    }
  // Web auth (mocked, no real verification)
  | { name: 'web_login'; role: 'doctor' | 'admin' }
  | { name: 'web_logout'; role: 'doctor' | 'admin' }

type Pipe = (e: AnalyticsEvent) => void

const consolePipe: Pipe = (e) => {
  // eslint-disable-next-line no-console
  console.info('[analytics]', e.name, e)
}

let pipe: Pipe = consolePipe

/** Swap the dispatch destination (e.g. for tests or production wiring). */
export function setAnalyticsPipe(next: Pipe) {
  pipe = next
}

export function track(event: AnalyticsEvent) {
  try {
    pipe(event)
  } catch {
    // analytics must never break the app
  }
}
