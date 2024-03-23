import { useInView } from '@react-spring/web';
import { Suspense } from 'react';
import { styled } from 'styled-components';

import { Box } from '../../../foundation/components/Box';
import { Flex } from '../../../foundation/components/Flex';
import { Image } from '../../../foundation/components/Image';
import { Link } from '../../../foundation/components/Link';
import { Text } from '../../../foundation/components/Text';
import { Color, Radius, Space, Typography } from '../../../foundation/styles/variables';
import { useBook } from '../hooks/useBook';

const _Wrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  border-radius: ${Radius.SMALL};
  background-color: ${Color.MONO_A};
  max-width: 192px;
  border: 1px solid ${Color.MONO_30};
`;

const _ImgWrapper = styled.div`
  > * {
    border-radius: ${Radius.SMALL} ${Radius.SMALL} 0 0;
  }
`;

const _AvatarWrapper = styled.div`
  width: 32px;
  height: 32px;
  > * {
    border-radius: 50%;
  }
`;

type Props = {
  bookId: string;
};

const BookCard: React.FC<Props> = ({ bookId }) => {
  const { data: book } = useBook({ params: { bookId } });

  const imageUrl = `/images/${book.image.id}_book_192w.avif`;
  const authorImageUrl = `/images/${book.author.image.id}.avif`;

  return (
    <>
      <_ImgWrapper>
        {imageUrl != null ? (
          <Image alt={book.image.alt} height={128} objectFit="cover" src={imageUrl} width={192} />
        ) : (
          <Box height={128} width={192} />
        )}
      </_ImgWrapper>

      <Flex align="stretch" direction="column" flexGrow={1} gap={Space * 1} justify="space-between" p={Space * 2}>
        <Text color={Color.MONO_100} typography={Typography.NORMAL14} weight="bold">
          {book.name}
        </Text>

        <Flex align="center" gap={Space * 1} justify="flex-end">
          <_AvatarWrapper>
            {authorImageUrl != null ? (
              <Image alt={book.author.name} height={32} objectFit="cover" src={authorImageUrl} width={32} />
            ) : (
              <Box height={32} width={32} />
            )}
          </_AvatarWrapper>
          <Text color={Color.MONO_100} typography={Typography.NORMAL12}>
            {book.author.name}
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

const Fallback = () => {
  return (
    <>
      <_ImgWrapper>
        <Box height={128} width={192} />
      </_ImgWrapper>

      <Flex align="stretch" direction="column" flexGrow={1} gap={Space * 1} justify="space-between" p={Space * 2}>
        <Text color={Color.MONO_100} typography={Typography.NORMAL14} weight="bold">
          ...
        </Text>

        <Flex align="center" gap={Space * 1} justify="flex-end">
          <_AvatarWrapper>
            <Box height={32} width={32} />
          </_AvatarWrapper>
          <Text color={Color.MONO_100} typography={Typography.NORMAL12}>
            ...
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

const BookCardWithSuspense: React.FC<Props> = (props) => {
  const [ref, isVisible] = useInView();

  return (
    <_Wrapper ref={ref} href={`/books/${props.bookId}`}>
      {isVisible ? (
        <Suspense fallback={<Fallback />}>
          <BookCard {...props} />
        </Suspense>
      ) : (
        <Fallback />
      )}
    </_Wrapper>
  );
};

export { BookCardWithSuspense as BookCard };
