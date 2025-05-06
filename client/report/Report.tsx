import { Table, Tabs } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useTitle } from 'client/shared/hooks/useTitle';
import { formatAmount } from 'client/shared/numberFormatter';
import { CalendarDaysIcon, ChartColumnStackedIcon, CreditCardIcon } from 'lucide-react';
import type { CardTypeSummary, TransactionsReport } from 'server/shared/entity';

export default function Report() {
  useTitle('Report');

  const { data: report } = useQuery<TransactionsReport>({
    queryKey: ['/api/report'],
  });

  return (
    <div className={'container'}>
      <Tabs defaultValue="byCardType" style={{ maxWidth: '50rem' }}>
        <Tabs.List>
          <Tabs.Tab value="byCardType" leftSection={<ChartColumnStackedIcon size={12} />}>
            By Card Type
          </Tabs.Tab>
          <Tabs.Tab value="byCard" leftSection={<CreditCardIcon size={12} />}>
            By Card
          </Tabs.Tab>
          <Tabs.Tab value="byDay" leftSection={<CalendarDaysIcon size={12} />}>
            By Day
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="byCardType">
          <ByCardType byCardType={report?.byCardType} />
        </Tabs.Panel>

        <Tabs.Panel value="byCard">TBD</Tabs.Panel>

        <Tabs.Panel value="byDay">TBD</Tabs.Panel>
      </Tabs>
    </div>
  );
}

function ByCardType({ byCardType = {} }: { byCardType: CardTypeSummary }) {
  const rows = Object.entries(byCardType).map(([type, value]) => (
    <Table.Tr key={type}>
      <Table.Td>{type}</Table.Td>
      <Table.Td className="amount">{value.count}</Table.Td>
      <Table.Td className={`amount ${value.totalAmount >= 0 ? 'positive' : 'negative'}`}>
        {formatAmount(value.totalAmount)}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Type</Table.Th>
          <Table.Th style={{ textAlign: 'right' }}>Count</Table.Th>
          <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
