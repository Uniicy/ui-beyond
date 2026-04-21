import { type HTMLAttributes } from 'react'
import styles from './transaction-summary-table.module.css'

export interface Transaction {
  readonly id: string
  readonly occurredAt: string
  readonly type: 'deposit' | 'withdrawal'
  readonly amount: number
  readonly currency: string
  readonly provider: string
  readonly balanceAfter: number
  readonly flagged?: boolean
}

export interface TransactionSummaryTableProps extends HTMLAttributes<HTMLDivElement> {
  readonly transactions: ReadonlyArray<Transaction>
  readonly currency: string
  readonly maxRows?: number
  readonly totalAmount?: number
  readonly onViewAll?: () => void
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '\u20ac',
  GBP: '\u00a3',
  USD: '$',
}

function formatAmount(minorUnits: number, currency: string): string {
  const major = (minorUnits / 100).toFixed(2)
  const symbol = CURRENCY_SYMBOLS[currency]
  if (symbol !== undefined) {
    return `${symbol}${Number(major).toLocaleString('en', { minimumFractionDigits: 2 })}`
  }
  return `${currency} ${Number(major).toLocaleString('en', { minimumFractionDigits: 2 })}`
}

function formatDate(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
  }
}

export function TransactionSummaryTable({
  transactions,
  currency,
  maxRows = 8,
  totalAmount,
  onViewAll,
  className,
  ...props
}: TransactionSummaryTableProps) {
  const visible = transactions.slice(0, maxRows)
  const hasOverflow = transactions.length > maxRows

  const tableClassNames = [styles['table'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={tableClassNames} {...props}>
      {/* Header */}
      <div className={styles['headerRow']}>
        <span className={styles['headerCell']}>Date / Time</span>
        <span className={styles['headerCell']}>Type</span>
        <span className={`${styles['headerCell']} ${styles['alignRight']}`}>Amount</span>
        <span className={styles['headerCell']}>Provider</span>
        <span className={`${styles['headerCell']} ${styles['alignRight']}`}>Balance</span>
      </div>

      {/* Data rows */}
      {visible.map((tx, i) => {
        const { date, time } = formatDate(tx.occurredAt)
        const rowClassNames = [
          styles['dataRow'],
          tx.flagged ? styles['rowFlagged'] : (i % 2 === 0 ? styles['rowEven'] : styles['rowOdd']),
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <div key={tx.id} className={rowClassNames}>
            <div className={styles['dateCell']}>
              <span className={styles['dateText']}>{date}</span>
              <span className={styles['timeText']}>{time}</span>
            </div>
            <div>
              <span className={`${styles['typePill']} ${tx.type === 'deposit' ? styles['typeDeposit'] : styles['typeWithdrawal']}`}>
                {tx.type === 'deposit' ? '\u2193' : '\u2191'} {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
              </span>
            </div>
            <span className={styles['amount']}>{formatAmount(tx.amount, tx.currency)}</span>
            <span className={styles['provider']}>{tx.provider}</span>
            <span className={styles['balance']}>{formatAmount(tx.balanceAfter, tx.currency)}</span>
          </div>
        )
      })}

      {/* Subtotal */}
      {totalAmount !== undefined && (
        <div className={styles['subtotalRow']}>
          <span className={styles['subtotalLabel']}>Total across {transactions.length} transactions</span>
          <span className={styles['subtotalAmount']}>{formatAmount(totalAmount, currency)}</span>
          <span />
          <span />
        </div>
      )}

      {/* View all */}
      {hasOverflow && onViewAll !== undefined && (
        <div className={styles['viewAll']}>
          <button type="button" className={styles['viewAllLink']} onClick={onViewAll}>
            View all {transactions.length} transactions {'\u2192'}
          </button>
        </div>
      )}
    </div>
  )
}
