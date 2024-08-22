import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationsEmailProps {
  username: string;
  opt: string;
}

export default function VerificationsEmailProps({
  username,
  opt,
}: VerificationsEmailProps) {
  return (
    <Html>
      <Head>
        <Heading>Verification Code</Heading>
      </Head>
      <Text>{username}</Text>
      <Text>{opt}</Text>
    </Html>
  );
}
