"use client"

import { useState } from "react"
import { Bell, RefreshCw, Filter, Search, Shield, MapPin, Clock, MoreVertical, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DashboardPageLayout from "@/components/dashboard/layout"
import CreditCardIcon from "@/components/icons/credit-card"
import { useTransactions } from "@/hooks/use-transactions"

// Helper function to format address
const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper function to get risk level based on amount
const getRiskLevel = (amount: string) => {
  const numAmount = parseFloat(amount);
  if (numAmount > 100) return "high";
  if (numAmount > 50) return "medium";
  return "low";
};

export default function TransactionsPage() {
  const { transactions, loading, error, hasFetched, fetchTransactions, clearCache } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (transaction: (typeof transactions)[0]) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Transactions",
        description: "Manage and monitor payment operations",
        icon: CreditCardIcon,
      }}
    >
      <div className="flex flex-col h-full min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border/40">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground hidden sm:inline">StablePay</span>
          <span className="text-muted-foreground hidden sm:inline">/</span>
          <span className="text-primary">TRANSACTIONS</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-xs text-muted-foreground hidden md:inline">
            LAST UPDATE:{" "}
            {new Date().toLocaleString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "UTC",
            })}{" "}
            UTC
          </span>
          <Button variant="ghost" size="icon" className="size-8">
            <Bell className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8">
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-auto">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-serif mb-2">Transaction Network</h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage and monitor payment operations</p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
              <Filter className="size-4 mr-2" />
              Filter
            </Button>
            {!hasFetched ? (
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground" 
                onClick={fetchTransactions} 
                disabled={loading}
                size="sm"
              >
                <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'See Transactions'}
              </Button>
            ) : (
              <>
                <Button 
                  variant="secondary" 
                  onClick={fetchTransactions} 
                  disabled={loading}
                  size="sm"
                >
                  <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearCache}
                  size="sm"
                >
                  Clear
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {/* Search Card */}
          <div className="col-span-2 md:col-span-1 bg-card border border-border/40 rounded-lg p-4 md:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 bg-background/50 border-border/40" />
            </div>
          </div>

          {/* Active Transactions */}
          <div className="bg-card border border-border/40 rounded-lg p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">TOTAL</div>
                <div className="text-2xl md:text-4xl font-bold">{loading ? "..." : transactions.length}</div>
              </div>
              <Shield className="size-6 md:size-8 text-foreground" />
            </div>
          </div>

          {/* Failed */}
          <div className="bg-card border border-border/40 rounded-lg p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">FAILED</div>
                <div className="text-2xl md:text-4xl font-bold text-red-500">0</div>
              </div>
              <Shield className="size-6 md:size-8 text-red-500" />
            </div>
          </div>

          {/* Pending */}
          <div className="bg-card border border-border/40 rounded-lg p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">PENDING</div>
                <div className="text-2xl md:text-4xl font-bold text-primary">0</div>
              </div>
              <Shield className="size-6 md:size-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-card border border-border/40 rounded-lg overflow-hidden flex-1 flex flex-col">
          <div className="p-6 border-b border-border/40">
            <h2 className="text-xl font-serif">TRANSACTION ROSTER</h2>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-full h-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground w-32">TRANSACTION ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground w-40">BUYER</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground w-40">RECEIVER</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground w-24">STATUS</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground w-32">BLOCK</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground w-24">AMOUNT SC</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground w-24">RISK</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground w-20">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                      Loading transactions from blockchain...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-red-500">
                      Error: {error}
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                      {!hasFetched ? "Click 'See Transactions' to load blockchain data" : "No StableCoin purchase events found"}
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction, index) => (
                    <tr
                      key={transaction.transactionHash}
                      onClick={() => handleRowClick(transaction)}
                      className="border-b border-border/40 hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-mono whitespace-nowrap">{formatAddress(transaction.transactionHash)}</td>
                      <td className="px-6 py-4 font-mono whitespace-nowrap">{formatAddress(transaction.buyer)}</td>
                      <td className="px-6 py-4 font-mono whitespace-nowrap">{formatAddress(transaction.receiver)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-green-500" />
                          <span className="uppercase text-sm">completed</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <MapPin className="size-4 text-muted-foreground" />
                          #{transaction.blockNumber.toString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono whitespace-nowrap">{transaction.amountSC} SC</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className={`uppercase ${
                            getRiskLevel(transaction.amountSC) === "high"
                              ? "bg-primary/20 text-primary border-primary/40"
                              : getRiskLevel(transaction.amountSC) === "medium"
                                ? "bg-muted text-muted-foreground"
                                : "bg-green-500/20 text-green-500 border-green-500/40"
                          }`}
                        >
                          {getRiskLevel(transaction.amountSC)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-8" 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://sepolia.etherscan.io/tx/${transaction.transactionHash}`, '_blank');
                          }}
                        >
                          <ExternalLink className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
                {/* Empty rows to fill remaining space */}
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={`empty-${index}`} className="border-b border-border/40">
                    <td className="px-6 py-4">&nbsp;</td>
                    <td className="px-6 py-4">&nbsp;</td>
                    <td className="px-6 py-4">&nbsp;</td>
                    <td className="px-6 py-4">&nbsp;</td>
                    <td className="px-6 py-4">&nbsp;</td>
                    <td className="px-6 py-4">&nbsp;</td>
                    <td className="px-6 py-4">&nbsp;</td>
                    <td className="px-6 py-4">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl w-[95vw] bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-display mb-2">
              Transaction Details
            </DialogTitle>
            <p className="text-muted-foreground font-mono text-sm break-all">
              {selectedTransaction?.transactionHash}
            </p>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            <div className="space-y-5">
              <div>
                <div className="text-sm text-muted-foreground mb-1">STATUS</div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span className="uppercase text-base font-medium">Completed</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">BLOCK NUMBER</div>
                <div className="text-xl font-bold font-mono">#{selectedTransaction?.blockNumber?.toString()}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">AMOUNT (SC)</div>
                <div className="text-xl font-bold">{selectedTransaction?.amountSC} SC</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">AMOUNT (ETH)</div>
                <div className="text-xl font-bold">{parseFloat(selectedTransaction?.amountBC || '0').toFixed(6)} ETH</div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-sm text-muted-foreground mb-1">BUYER ADDRESS</div>
                <div className="text-sm font-mono break-all bg-muted/50 p-2 rounded">{selectedTransaction?.buyer}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">RECEIVER ADDRESS</div>
                <div className="text-sm font-mono break-all bg-muted/50 p-2 rounded">{selectedTransaction?.receiver}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">RISK LEVEL</div>
                <Badge
                  variant="secondary"
                  className={`uppercase text-sm px-3 py-1 ${
                    getRiskLevel(selectedTransaction?.amountSC || '0') === "high"
                      ? "bg-primary/20 text-primary border-primary/40"
                      : getRiskLevel(selectedTransaction?.amountSC || '0') === "medium"
                        ? "bg-muted text-muted-foreground"
                        : "bg-green-500/20 text-green-500 border-green-500/40"
                  }`}
                >
                  {getRiskLevel(selectedTransaction?.amountSC || '0')}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/40">
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none"
              onClick={() => window.open(`https://sepolia.etherscan.io/tx/${selectedTransaction?.transactionHash}`, '_blank')}
            >
              <ExternalLink className="size-4 mr-2" />
              View on Etherscan
            </Button>
            <Button 
              variant="outline" 
              className="border-border/40 bg-transparent"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardPageLayout>
  )
}
