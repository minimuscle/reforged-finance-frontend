import { ActionFunctionArgs } from "@remix-run/node"
import { createCash, deleteCash, updateCash } from "~/utils/supabase"
import DataDefer from "~/components/DataDefer"
import { isRouteErrorResponse, useRouteError } from "@remix-run/react"
import { Box, Group } from "@mantine/core"
import Sidebar from "./components/Sidebar/Sidebar"
import styles from "./cash.module.css"
import Totals from "./components/Totals"

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const intent = formData.get("intent")
  console.log(intent)

  switch (intent) {
    case "createCash":
      createCash(request, formData)
      break
    case "updateCash":
      updateCash(request, formData)
      break
    case "deleteCash":
      deleteCash(request, formData.get("id") as string)
      break
  }
  return null
}

export const ErrorBoundary = () => {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    )
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    )
  } else {
    return <h1>Unknown Error</h1>
  }
}

export default function Cash() {
  return (
    <Group className={styles.cashContainer} gap={0}>
      <Box className={styles.sidebar}>
        <DataDefer>
          <Sidebar />
        </DataDefer>
      </Box>
      <Box className={styles.content}>
        <DataDefer>
          <Totals />
        </DataDefer>
      </Box>
    </Group>
  )
}
