import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Transaction } from '@money-sprouts/shared/domain';
import {
    combineLatest,
    map,
    Observable,
    of,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import {
    debounceTime,
    distinctUntilChanged,
    shareReplay,
} from 'rxjs/operators';

interface TransactionData {
    transactions: {
        incomes: Transaction[];
        expenses: Transaction[];
    };
}

interface CombinedDataTransaction {
    transactions: TransactionData;
    maxLength: number;
}

@Component({
    selector: 'money-sprouts-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent implements OnInit, OnDestroy {
    account$: Observable<Account | null>;

    combinedDataTransaction$: Observable<CombinedDataTransaction>;
    latestCombinedData: CombinedDataTransaction | null = null;

    initialItems = 5;
    displayedItems = this.initialItems;

    Math = Math;

    public isExpanded = false;

    private destroy$ = new Subject<void>();

    constructor(
        private readonly accountService: AccountService,
        private readonly transactionService: TransactionService
    ) {}

    ngOnInit() {
        this.account$ = this.accountService.currentAccount$.pipe(
            distinctUntilChanged((prev, curr) => {
                return prev && curr ? prev.id === curr.id : prev === curr;
            }),
            debounceTime(300) // waits 300ms between emisssions
        );

        const transactions$ = this.account$.pipe(
            switchMap((account) => {
                console.log(
                    'transaction-history, ngOnInit, switchMap, account$ emitted:',
                    account
                );

                if (account && account.id) {
                    return this.transactionService.getTransactionsByAccountId(
                        account.id
                    );
                } else {
                    return of([]);
                }
            }),
            map((transactions) => {
                console.log(
                    'Loaded transactions in ngOnInit via account$:',
                    transactions
                );
                const incomes = transactions.filter(
                    (transaction) => transaction.type === 1
                );
                const expenses = transactions.filter(
                    (transaction) => transaction.type === 2
                );

                return {
                    transactions: {
                        incomes,
                        expenses,
                    },
                };
            }),
            shareReplay(1)
        );

        const maxLength$ = transactions$.pipe(
            map((transactionData) =>
                this.Math.max(
                    transactionData.transactions.incomes.length,
                    transactionData.transactions.expenses.length
                )
            )
        );

        this.combinedDataTransaction$ = combineLatest([
            transactions$,
            maxLength$,
        ]).pipe(
            map(([transactions, maxLength]) => {
                return {
                    transactions,
                    maxLength,
                };
            }),
            shareReplay(1),
            takeUntil(this.destroy$)
        );

        this.combinedDataTransaction$.subscribe((data) => {
            console.log(
                'subscribed to transactions to get latestCombinedData',
                data
            );
            this.latestCombinedData = data;
        });
    }

    showMore() {
        if (this.latestCombinedData) {
            this.displayedItems = Math.min(
                this.displayedItems + 5,
                this.latestCombinedData.maxLength
            );
        }
    }

    hideExtra() {
        this.displayedItems = -5;
        if (this.displayedItems < this.initialItems) {
            this.displayedItems = this.initialItems;
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
