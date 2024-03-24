import { styled } from 'styled-components';

import type { GetReleaseResponse } from '@wsh-2024/schema/src/api/releases/GetReleaseResponse';

import { Flex } from '../../../foundation/components/Flex';
import { Image } from '../../../foundation/components/Image';
import { Link } from '../../../foundation/components/Link';
import { Text } from '../../../foundation/components/Text';
import { Color, Radius, Space, Typography } from '../../../foundation/styles/variables';
import { getImageUrl } from '../../../lib/image/getImageUrl';
import type { Unpacked } from '../../../lib/types';

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
  book: Unpacked<GetReleaseResponse['books']>;
};

const BookCard: React.FC<Props> = ({ book }) => {
  const imageUrl = getImageUrl({
    format: 'avif',
    height: 128,
    imageId: book.image.id,
    width: 192,
  });
  const authorImageUrl = getImageUrl({
    format: 'avif',
    imageId: book.author.image.id,
  });

  return (
    <_Wrapper href={`/books/${book.id}`}>
      <_ImgWrapper>
        <Image alt={book.image.alt} height={128} loading="lazy" objectFit="cover" src={imageUrl} width={192} />
      </_ImgWrapper>

      <Flex align="stretch" direction="column" flexGrow={1} gap={Space * 1} justify="space-between" p={Space * 2}>
        <Text color={Color.MONO_100} typography={Typography.NORMAL14} weight="bold">
          {book.name}
        </Text>

        <Flex align="center" gap={Space * 1} justify="flex-end">
          <_AvatarWrapper>
            <Image
              alt={book.author.name}
              height={32}
              loading="lazy"
              objectFit="cover"
              src={authorImageUrl}
              width={32}
            />
          </_AvatarWrapper>
          <Text color={Color.MONO_100} typography={Typography.NORMAL12}>
            {book.author.name}
          </Text>
        </Flex>
      </Flex>
    </_Wrapper>
  );
};

export { BookCard };
