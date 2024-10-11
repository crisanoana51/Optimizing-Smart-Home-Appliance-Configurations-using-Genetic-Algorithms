package licenta.retrievedata.util;

import licenta.retrievedata.entitites.RetrievedData;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.io.FileInputStream;

@Service
public class ExcelReader {

    private static double convertPriceToDouble(String value) {
        String valueWithoutDot = value.replace(".", "");
        double doubleValue = Double.parseDouble(valueWithoutDot);
        double newValue = doubleValue + 0.99;
        return newValue;
    }

    public List<RetrievedData> readExcelFile(String filePath) {
        try {
            System.out.println("Attempting to read file: " + filePath);

            FileInputStream file = new FileInputStream(filePath);

            Workbook workbook = WorkbookFactory.create(file);

            Sheet sheet = workbook.getSheetAt(0);

            System.out.println("Reading sheet: " + sheet.getSheetName());

            Iterator<Row> rowIterator = sheet.iterator();
            List<RetrievedData> retrievedDataList = new ArrayList<>();

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();

                if (row.getRowNum() == 0)
                    continue;

                System.out.println("Reading row: " + row.getRowNum());

                String title = row.getCell(0).getStringCellValue();
                String titleUrl = row.getCell(1).getStringCellValue();
                String imageUrl = row.getCell(2).getStringCellValue();
                String price = row.getCell(3).getStringCellValue();
                String description = row.getCell(4).getStringCellValue();

                System.out.println("Row data - Title: " + title + ", Title URL: " + titleUrl +
                        ", Image URL: " + imageUrl + ", Price: " + price +
                        ", Description: " + description);

                RetrievedData retrievedData = new RetrievedData();
                retrievedData.setUrl(titleUrl);
                retrievedData.setPrice(convertPriceToDouble(price));
                retrievedData.setDescription(description);
                retrievedData.setTitle(title);
                retrievedData.setImageUrl(imageUrl);

                retrievedDataList.add(retrievedData);
            }

            workbook.close();
            file.close();
            System.out.println("Read " + retrievedDataList.size() + " entries from " + filePath);
            return retrievedDataList;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return Collections.emptyList();
    }
}
