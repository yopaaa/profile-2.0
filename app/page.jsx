// export default async function UserPage({ params }) {
//   const { username } = await params;

//   return (
//     <div>
//       <h1>User: {username}</h1>
//     </div>
//   );
// }

import { redirect } from 'next/navigation';

export default function Page() {

    redirect('/yopa');

  return null;
}
