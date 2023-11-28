import {
  DndContext,
  DragOverlay,
  closestCenter,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Box, Button, Grid, Group, Paper, Text, Title } from "@mantine/core"
import { useFetcher, useLoaderData } from "@remix-run/react"
import SortableAccount from "./SortableAccount"
import { useEffect, useState } from "react"
import {
  restrictToParentElement,
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers"

const Accounts = () => {
  const { cash } = useLoaderData()
  const [accounts, setAccounts] = useState(cash)
  const fetcher = useFetcher()

  useEffect(() => {
    setAccounts(cash)
  }, [cash])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = cash.findIndex((item) => item.id === active.id)
      const newIndex = cash.findIndex((item) => item.id === over.id)
      const newAccount = arrayMove(cash, oldIndex, newIndex)
      setAccounts(newAccount)
      newAccount.forEach((account, index) => {
        account.weight = index
        console.log("account: ", account)
      })
      fetcher.submit(
        {
          _action: "updateBankOrder",
          accounts: JSON.stringify(newAccount),
        },
        { method: "POST" }
      )
      console.log("newAccount: ", newAccount)
    }
  }

  return (
    <Paper shadow='xl' p='md' withBorder w='40%' align='center'>
      <Title>Bank Accounts</Title>
      <Box mt='lg'>
        <Grid grow m='0 10px 10px 10px'>
          <Grid.Col span={5.5} align='left'>
            <Text size='sm' fw={700}>
              Account Name
            </Text>
          </Grid.Col>
          <Grid.Col span={3} align='left'>
            <Text size='sm' fw={700}>
              Account Balance
            </Text>
          </Grid.Col>
          <Grid.Col span={2} align='left'>
            <Text size='sm' fw={700}>
              Currency
            </Text>
          </Grid.Col>
          <Grid.Col span={1.5}></Grid.Col>
        </Grid>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext items={cash} strategy={verticalListSortingStrategy}>
            {accounts.map((account) => (
              <SortableAccount key={account.id} {...account} handle />
            ))}
          </SortableContext>
        </DndContext>
      </Box>
    </Paper>
  )
}

export default Accounts
