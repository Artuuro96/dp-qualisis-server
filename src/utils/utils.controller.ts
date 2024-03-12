import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { UtilService } from './utils.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'multer';

@Controller('utils')
@UseGuards(AuthGuard)
export class UtilController {
  constructor(private readonly utilService: UtilService) {}

  @Post()
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=output.xlsx')
  @UseInterceptors(AnyFilesInterceptor())
  async readExcel(@UploadedFiles() files: Array<MulterFile>, @Body() excelOptions) {
    const data = await this.utilService.readExcelBuffer(files, excelOptions);
    return new StreamableFile(data);
  }
}
